'use server';

import { Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { engagementService } from '../services/engagement.service';
import type {
    Communication,
    CreateCommunicationInput,
    CreateMeetingInput,
    Meeting,
    UpdateCommunicationInput,
    UpdateMeetingInput,
} from '../types/communication.types';

/**
 * 添加溝通記錄
 */
export async function addCommunicationAction(
    engagementId: string,
    data: CreateCommunicationInput
): Promise<{ success: boolean; error?: string }> {
    try {
        const communication: Omit<Communication, 'id'> = {
            ...data,
            date: data.date instanceof Date ? Timestamp.fromDate(data.date) : data.date,
            followUpDate: data.followUpDate
                ? (data.followUpDate instanceof Date ? Timestamp.fromDate(data.followUpDate) : data.followUpDate)
                : undefined,
            createdBy: 'current-user', // TODO: 從認證系統獲取
            createdAt: Timestamp.now(),
            updatedBy: 'current-user',
            updatedAt: Timestamp.now(),
        };

        await engagementService.addCommunication(engagementId, communication);
        revalidatePath(`/core-operations/engagements/${engagementId}`);
        revalidatePath('/core-operations/engagements');

        return { success: true };
    } catch (error) {
        console.error('Error adding communication:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '添加溝通記錄失敗'
        };
    }
}

/**
 * 更新溝通記錄
 */
export async function updateCommunicationAction(
    engagementId: string,
    communicationId: string,
    data: UpdateCommunicationInput
): Promise<{ success: boolean; error?: string }> {
    try {
        const updateData: Partial<Communication> = {
            ...data,
            date: data.date instanceof Date ? Timestamp.fromDate(data.date) : data.date,
            followUpDate: data.followUpDate
                ? (data.followUpDate instanceof Date ? Timestamp.fromDate(data.followUpDate) : data.followUpDate)
                : undefined,
            updatedBy: 'current-user',
            updatedAt: Timestamp.now(),
        };

        await engagementService.updateCommunication(engagementId, communicationId, updateData);
        revalidatePath(`/core-operations/engagements/${engagementId}`);
        revalidatePath('/core-operations/engagements');

        return { success: true };
    } catch (error) {
        console.error('Error updating communication:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '更新溝通記錄失敗'
        };
    }
}

/**
 * 刪除溝通記錄
 */
export async function deleteCommunicationAction(
    engagementId: string,
    communicationId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await engagementService.deleteCommunication(engagementId, communicationId);
        revalidatePath(`/core-operations/engagements/${engagementId}`);
        revalidatePath('/core-operations/engagements');

        return { success: true };
    } catch (error) {
        console.error('Error deleting communication:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '刪除溝通記錄失敗'
        };
    }
}

/**
 * 添加會議
 */
export async function addMeetingAction(
    engagementId: string,
    data: CreateMeetingInput
): Promise<{ success: boolean; error?: string }> {
    try {
        const meeting: Omit<Meeting, 'id'> = {
            ...data,
            status: 'scheduled',
            scheduledDate: data.scheduledDate instanceof Date ? Timestamp.fromDate(data.scheduledDate) : data.scheduledDate,
            actualStartDate: data.actualStartDate instanceof Date ? Timestamp.fromDate(data.actualStartDate) : data.actualStartDate,
            actualEndDate: data.actualEndDate instanceof Date ? Timestamp.fromDate(data.actualEndDate) : data.actualEndDate,
            createdBy: 'current-user',
            createdAt: Timestamp.now(),
            updatedBy: 'current-user',
            updatedAt: Timestamp.now(),
        };

        await engagementService.addMeeting(engagementId, meeting);
        revalidatePath(`/core-operations/engagements/${engagementId}`);
        revalidatePath('/core-operations/engagements');

        return { success: true };
    } catch (error) {
        console.error('Error adding meeting:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '添加會議失敗'
        };
    }
}

/**
 * 更新會議
 */
export async function updateMeetingAction(
    engagementId: string,
    meetingId: string,
    data: UpdateMeetingInput
): Promise<{ success: boolean; error?: string }> {
    try {
        const updateData: Partial<Meeting> = {
            ...data,
            scheduledDate: data.scheduledDate instanceof Date ? Timestamp.fromDate(data.scheduledDate) : data.scheduledDate,
            actualStartDate: data.actualStartDate instanceof Date ? Timestamp.fromDate(data.actualStartDate) : data.actualStartDate,
            actualEndDate: data.actualEndDate instanceof Date ? Timestamp.fromDate(data.actualEndDate) : data.actualEndDate,
            actionItems: data.actionItems?.map(item => ({
                ...item,
                id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            })),
            decisions: data.decisions?.map(decision => ({
                ...decision,
                id: `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            })),
            updatedBy: 'current-user',
            updatedAt: Timestamp.now(),
        };

        await engagementService.updateMeeting(engagementId, meetingId, updateData);
        revalidatePath(`/core-operations/engagements/${engagementId}`);
        revalidatePath('/core-operations/engagements');

        return { success: true };
    } catch (error) {
        console.error('Error updating meeting:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '更新會議失敗'
        };
    }
}

/**
 * 刪除會議
 */
export async function deleteMeetingAction(
    engagementId: string,
    meetingId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await engagementService.deleteMeeting(engagementId, meetingId);
        revalidatePath(`/core-operations/engagements/${engagementId}`);
        revalidatePath('/core-operations/engagements');

        return { success: true };
    } catch (error) {
        console.error('Error deleting meeting:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '刪除會議失敗'
        };
    }
}
