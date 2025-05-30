import mongoose from 'mongoose';
import Combat, { ICombat } from '../combats/combat_models.js';

export const saveMethod = () => {
    return 'Hola';
};
export const createCombat = async (combatData: Partial<ICombat>) => {
    // Validar y convertir IDs a ObjectId si son string
    if (combatData.creator && typeof combatData.creator === 'string') {
        combatData.creator = new mongoose.Types.ObjectId(combatData.creator);
    }
    if (combatData.opponent && typeof combatData.opponent === 'string') {
        combatData.opponent = new mongoose.Types.ObjectId(combatData.opponent);
    }
    if (combatData.gym && typeof combatData.gym === 'string') {
        combatData.gym = new mongoose.Types.ObjectId(combatData.gym);
    }
    const combat = new Combat(combatData);
    return await combat.save();
};

// Devuelve todos los combates aceptados donde el usuario es creator u opponent
export const getFutureCombats = async (userId: string) => {
    return Combat.find({
        status: 'accepted',
        $or: [{ creator: userId }, { opponent: userId }]
    })
    .populate('creator')
    .populate('opponent')
    .populate('gym');
};

// Devuelve todas las invitaciones pendientes donde el usuario es opponent
export const getPendingInvitations = async (userId: string) => {
    return Combat.find({ opponent: userId, status: 'pending' })
        .populate('creator')
        .populate('opponent')
        .populate('gym');
};

// Devuelve todas las invitaciones pendientes enviadas por el usuario (creator)
export const getSentInvitations = async (userId: string) => {
    return Combat.find({ creator: userId, status: 'pending' })
        .populate('creator')
        .populate('opponent')
        .populate('gym');
};

// Permite que solo el opponent acepte o rechace la invitación
export const respondToCombatInvitation = async (
    combatId: string,
    userId: string,
    status: 'accepted' | 'rejected'
) => {
    const combat = await Combat.findById(combatId);
    if (!combat) throw new Error('Combate no encontrado');
    if (combat.opponent.toString() !== userId) throw new Error('Solo el usuario invitado puede responder');
    if (status === 'accepted') {
        combat.status = 'accepted';
        await combat.save();
        return combat;
    } else if (status === 'rejected') {
        await Combat.deleteOne({ _id: combatId });
        return { deleted: true };
    } else {
        throw new Error('Estado inválido');
    }
};

export const getAllCombats = async (page: number, pageSize: number) => {
    try {
        // Contar el número de registros omitidos
        const skip = (page - 1) * pageSize;
        
        // Consulta de registros totales
        const totalCombats = await Combat.countDocuments();
        
        // cCalcular el número total de páginas
        const totalPages = Math.ceil(totalCombats / pageSize);
        
        // cObtener la página actual de registros
        const combats = await Combat.find().skip(skip).limit(pageSize);
        
        // Devolución de información y registros de paginación
        return {
            combats,
            totalCombats,
            totalPages,
            currentPage: page,
            pageSize
        };
    } catch (error) {
        console.error('Error in getAllCombats:', error);
        throw error;
    }
};

export const getCombatById = async (id: string) => {
    return await Combat.findById(id)
        .populate('creator')
        .populate('opponent')
        .populate('gym');
};

export const updateCombat = async (id: string, updateData: Partial<ICombat>) => {
    return await Combat.updateOne({ _id: id }, { $set: updateData });
};

export const deleteCombat = async (id: string) => {
    return await Combat.deleteOne({ _id: id });
};

export const getBoxersByCombatId = async (id: string) => {
    const combat = await Combat.findById(id)
        .populate('creator')
        .populate('opponent');
    if (!combat) return [];
    // Devuelve creator y opponent como "boxers"
    return [
        combat.creator,
        combat.opponent
    ];
};

export const hideCombat = async (id: string, isHidden: boolean) => {
    return await Combat.updateOne({ _id: id }, { $set: { isHidden } });
};

export const getCombatsByGymId = async (gymId: string, page: number, pageSize: number) => {
    try {
        const skip = (page - 1) * pageSize;
        // gym字段是ObjectId类型，查询时需转换
        const query = { gym: new mongoose.Types.ObjectId(gymId), isHidden: false };
        const totalCombats = await Combat.countDocuments(query);
        const totalPages = Math.ceil(totalCombats / pageSize);
        const combats = await Combat.find(query)
            .skip(skip)
            .limit(pageSize)
            .populate('gym')
            .populate('creator')
            .populate('opponent');
        return {
            combats,
            totalCombats,
            totalPages,
            currentPage: page,
            pageSize
        };
    } catch (error) {
        console.error('Error in getCombatsByGymId:', error);
        throw error;
    }
};