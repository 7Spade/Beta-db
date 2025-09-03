/**
 * @fileoverview 類型定義測試
 * 確保所有類型定義正確且一致
 */

import type {
    AcceptanceRecord,
    Attachment,
    Deliverable,
    Engagement,
    Milestone,
    Payment,
    QualityCheck,
    Task
} from '../types';

describe('Engagement Types', () => {
    test('Engagement 類型應該包含所有必要屬性', () => {
        const engagement: Engagement = {
            id: 'test-id',
            name: 'Test Engagement',
            description: 'Test Description',
            contractor: 'Test Contractor',
            client: 'Test Client',
            clientRepresentative: 'Test Rep',
            startDate: new Date(),
            endDate: new Date(),
            actualStartDate: new Date(),
            actualEndDate: new Date(),
            totalValue: 100000,
            currency: 'TWD',
            status: 'active',
            phase: 'planning',
            scope: 'Test Scope',
            tasks: [],
            milestones: [],
            deliverables: [],
            payments: [],
            receipts: [],
            invoices: [],
            changeOrders: [],
            versions: [],
            progress: {
                overallProgress: 0,
                taskProgress: 0,
                financialProgress: 0,
                qualityProgress: 0
            },
            risks: [],
            issues: [],
            communications: [],
            meetings: [],
            documents: [],
            attachments: [],
            auditLog: [],
            createdBy: 'test-user',
            createdAt: new Date(),
            updatedBy: 'test-user',
            updatedAt: new Date()
        };

        expect(engagement.id).toBe('test-id');
        expect(engagement.name).toBe('Test Engagement');
        expect(engagement.tasks).toEqual([]);
    });

    test('Task 類型應該包含 lastUpdated 屬性', () => {
        const task: Task = {
            id: 'task-id',
            title: 'Test Task',
            description: 'Test Description',
            status: '待處理',
            priority: '中',
            lastUpdated: new Date(),
            subTasks: [],
            value: 1000,
            quantity: 1,
            unitPrice: 1000,
            completedQuantity: 0,
            startDate: new Date(),
            endDate: new Date(),
            createdBy: 'test-user',
            createdAt: new Date(),
            updatedBy: 'test-user',
            updatedAt: new Date()
        };

        expect(task.lastUpdated).toBeInstanceOf(Date);
    });

    test('Milestone 類型應該包含 name 和 dueDate 屬性', () => {
        const milestone: Milestone = {
            id: 'milestone-id',
            title: 'Test Milestone',
            name: 'Test Milestone',
            description: 'Test Description',
            status: '未開始',
            plannedDate: new Date(),
            dueDate: new Date(),
            progress: 0,
            createdBy: 'test-user',
            createdAt: new Date(),
            updatedBy: 'test-user',
            updatedAt: new Date()
        };

        expect(milestone.name).toBe('Test Milestone');
        expect(milestone.dueDate).toBeInstanceOf(Date);
    });

    test('Deliverable 類型應該包含 name 屬性', () => {
        const deliverable: Deliverable = {
            id: 'deliverable-id',
            title: 'Test Deliverable',
            name: 'Test Deliverable',
            description: 'Test Description',
            status: '未開始',
            type: 'document',
            plannedDate: new Date(),
            progress: 0,
            createdBy: 'test-user',
            createdAt: new Date(),
            updatedBy: 'test-user',
            updatedAt: new Date()
        };

        expect(deliverable.name).toBe('Test Deliverable');
    });

    test('Payment 類型應該包含 paymentDate 和 dueDate 屬性', () => {
        const payment: Payment = {
            id: 'payment-id',
            amount: 1000,
            status: '待處理',
            requestDate: new Date(),
            paymentDate: new Date(),
            dueDate: new Date(),
            description: 'Test Payment',
            createdBy: 'test-user',
            createdAt: new Date(),
            updatedBy: 'test-user',
            updatedAt: new Date()
        };

        expect(payment.paymentDate).toBeInstanceOf(Date);
        expect(payment.dueDate).toBeInstanceOf(Date);
    });

    test('QualityCheck 類型應該包含 name 和 checkDate 屬性', () => {
        const qualityCheck: QualityCheck = {
            id: 'quality-check-id',
            title: 'Test Quality Check',
            name: 'Test Quality Check',
            description: 'Test Description',
            status: '待檢查',
            type: 'inspection',
            plannedDate: new Date(),
            checkDate: new Date(),
            criteria: [],
            createdBy: 'test-user',
            createdAt: new Date(),
            updatedBy: 'test-user',
            updatedAt: new Date()
        };

        expect(qualityCheck.name).toBe('Test Quality Check');
        expect(qualityCheck.checkDate).toBeInstanceOf(Date);
    });

    test('AcceptanceRecord 類型應該包含所有必要屬性', () => {
        const acceptanceRecord: AcceptanceRecord = {
            id: 'acceptance-record-id',
            title: 'Test Acceptance Record',
            engagementId: 'engagement-id',
            engagementName: 'Test Engagement',
            submittedQuantity: 1,
            applicantId: 'applicant-id',
            applicantName: 'Test Applicant',
            status: '草稿',
            submittedAt: new Date(),
            createdBy: 'test-user',
            createdAt: new Date(),
            updatedBy: 'test-user',
            updatedAt: new Date()
        };

        expect(acceptanceRecord.engagementId).toBe('engagement-id');
        expect(acceptanceRecord.applicantId).toBe('applicant-id');
    });

    test('Attachment 類型應該包含 createdBy 屬性', () => {
        const attachment: Attachment = {
            id: 'attachment-id',
            name: 'Test Attachment',
            description: 'Test Description',
            fileUrl: 'https://example.com/file.pdf',
            fileName: 'file.pdf',
            fileSize: 1024,
            mimeType: 'application/pdf',
            uploadedBy: 'test-user',
            createdBy: 'test-user',
            uploadedAt: new Date()
        };

        expect(attachment.createdBy).toBe('test-user');
    });
});
