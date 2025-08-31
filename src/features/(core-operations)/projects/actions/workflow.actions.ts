
'use server';

import {
  createAcceptanceRecord,
  approveAcceptanceRecord,
} from './acceptance.actions';
import type { AcceptanceRecord, Task } from '../types';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface SubmitProgressInput {
  projectId: string;
  taskId: string;
  taskTitle: string;
  submittedQuantity: number;
  notes?: string;
  applicantId: string;
  applicantName: string;
  reviewerId: string;
}

/**
 * Workflow Action: Submits task progress which in turn creates an acceptance record.
 * This is the primary entry point for users reporting progress.
 */
export async function submitTaskProgressForReview(
  input: SubmitProgressInput
): Promise<ActionResult> {
  const {
    projectId,
    taskId,
    taskTitle,
    submittedQuantity,
    notes,
    applicantId,
    applicantName,
    reviewerId,
  } = input;

  // This workflow first creates a draft acceptance record, then submits it.
  // We can simplify this to just create a 'Pending' record directly for this workflow.
  try {
    const result = await createAcceptanceRecord({
      projectId,
      taskId,
      title: `${taskTitle} - 進度回報`,
      projectName: 'N/A', // projectName can be fetched inside the action if needed
      submittedQuantity,
      applicantId,
      applicantName,
      reviewerId,
      notes,
    });

    if (!result.success || !result.recordId) {
      throw new Error(result.error || 'Failed to create acceptance record.');
    }

    // This could be a separate step, but for this workflow, we create and submit.
    // In a more complex scenario, you might just call create, and a user would manually submit.
    const submitResult = await approveAcceptanceRecord(
      result.recordId,
      'system_auto_submit'
    ); // Or a specific user ID

    if (!submitResult.success) {
      throw new Error(
        submitResult.error || 'Failed to submit acceptance record.'
      );
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : '發生未知錯誤';
    console.error('Submit Task Progress Error:', message);
    return { success: false, error: message };
  }
}

interface ApproveAcceptanceInput {
  acceptanceId: string;
  adminId: string; // ID of the user approving
}

/**
 * Workflow Action: Approves an acceptance record and updates the corresponding task.
 * This function is a high-level wrapper that orchestrates the approval process.
 */
export async function approveAcceptanceWorkflow({
  acceptanceId,
  adminId,
}: ApproveAcceptanceInput): Promise<ActionResult> {
  // The core logic is now in `approveAcceptanceRecord`.
  // This workflow action can add more steps in the future, like sending notifications.
  return approveAcceptanceRecord(acceptanceId, adminId);
}
