/**
 * @fileoverview 簡化的修復驗證測試
 */
import { describe, expect, test } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

// 測試文件存在性
describe('File Existence Validation', () => {
    test('Charts 組件文件應該存在', () => {
        const chartsDir = path.resolve(__dirname, '../components/charts');
        const expectedFiles = [
            'engagement-chart.tsx',
            'financial-chart.tsx',
            'progress-chart.tsx',
            'quality-chart.tsx',
            'index.ts'
        ];

        expectedFiles.forEach(file => {
            const filePath = path.join(chartsDir, file);
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    test('Dialogs 組件文件應該存在', () => {
        const dialogsDir = path.resolve(__dirname, '../components/dialogs');
        const expectedFiles = [
            'engagement-details-dialog.tsx',
            'delete-engagement-dialog.tsx',
            'confirmation-dialog.tsx',
            'engagement-dialog.tsx',
            'index.ts'
        ];

        expectedFiles.forEach(file => {
            const filePath = path.join(dialogsDir, file);
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    test('Tables 組件文件應該存在', () => {
        const tablesDir = path.resolve(__dirname, '../components/tables');
        const expectedFiles = [
            'engagements-table.tsx',
            'tasks-table.tsx',
            'payments-table.tsx',
            'engagement-table.tsx',
            'task-table.tsx',
            'index.ts'
        ];

        expectedFiles.forEach(file => {
            const filePath = path.join(tablesDir, file);
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });
});

// 測試文件內容
describe('File Content Validation', () => {
    test('Charts 組件應該包含正確的導出', () => {
        const indexPath = path.resolve(__dirname, '../components/charts/index.ts');
        const content = fs.readFileSync(indexPath, 'utf8');

        expect(content).toContain('EngagementChart');
        expect(content).toContain('FinancialChart');
        expect(content).toContain('ProgressChart');
        expect(content).toContain('QualityChart');
    });

    test('Dialogs 組件應該包含正確的導出', () => {
        const indexPath = path.resolve(__dirname, '../components/dialogs/index.ts');
        const content = fs.readFileSync(indexPath, 'utf8');

        expect(content).toContain('EngagementDetailsDialog');
        expect(content).toContain('DeleteEngagementDialog');
        expect(content).toContain('ConfirmationDialog');
        expect(content).toContain('EngagementDialog');
    });

    test('Tables 組件應該包含正確的導出', () => {
        const indexPath = path.resolve(__dirname, '../components/tables/index.ts');
        const content = fs.readFileSync(indexPath, 'utf8');

        expect(content).toContain('EngagementsTable');
        expect(content).toContain('TasksTable');
        expect(content).toContain('PaymentsTable');
        expect(content).toContain('EngagementTable');
        expect(content).toContain('TaskTable');
    });
});

// 測試主索引文件
describe('Main Index Validation', () => {
    test('主組件索引應該包含新組件導出', () => {
        const indexPath = path.resolve(__dirname, '../components/index.ts');
        const content = fs.readFileSync(indexPath, 'utf8');

        expect(content).toContain("export * from './charts'");
        expect(content).toContain("export * from './dialogs'");
        expect(content).toContain("export * from './tables'");
    });

    test('模組主索引應該包含新組件', () => {
        const indexPath = path.resolve(__dirname, '../index.ts');
        const content = fs.readFileSync(indexPath, 'utf8');

        // 檢查關鍵組件是否在導出列表中
        expect(content).toContain('EngagementChart');
        expect(content).toContain('FinancialChart');
        expect(content).toContain('ProgressChart');
        expect(content).toContain('QualityChart');
        expect(content).toContain('EngagementDetailsDialog');
        expect(content).toContain('DeleteEngagementDialog');
        expect(content).toContain('ConfirmationDialog');
        expect(content).toContain('EngagementDialog');
        expect(content).toContain('EngagementsTable');
        expect(content).toContain('TasksTable');
        expect(content).toContain('PaymentsTable');
        expect(content).toContain('EngagementTable');
        expect(content).toContain('TaskTable');
    });
});

// 測試代碼品質
describe('Code Quality Validation', () => {
    test('組件文件應該遵循簡潔主義原則', () => {
        const componentFiles = [
            '../components/charts/engagement-chart.tsx',
            '../components/dialogs/confirmation-dialog.tsx',
            '../components/tables/engagements-table.tsx'
        ];

        componentFiles.forEach(file => {
            const filePath = path.resolve(__dirname, file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');

                // 檢查文件長度（應該少於 200 行）
                const lines = content.split('\n').length;
                expect(lines).toBeLessThan(200);

                // 檢查是否有適當的註釋
                expect(content).toContain('@fileoverview');

                // 檢查是否有類型定義
                expect(content).toContain('interface');

                // 檢查是否有導出
                expect(content).toContain('export');
            }
        });
    });

    test('組件應該有適當的 TypeScript 類型', () => {
        const componentFiles = [
            '../components/charts/engagement-chart.tsx',
            '../components/dialogs/confirmation-dialog.tsx',
            '../components/tables/engagements-table.tsx'
        ];

        componentFiles.forEach(file => {
            const filePath = path.resolve(__dirname, file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');

                // 檢查是否有 TypeScript 類型定義
                expect(content).toContain('interface');
                expect(content).toContain('Props');

                // 檢查是否有適當的導入
                expect(content).toContain("'use client'");
                expect(content).toContain('import');
            }
        });
    });
});

// 測試修復完成度
describe('Repair Completion Validation', () => {
    test('所有空目錄問題應該已解決', () => {
        const directories = [
            '../components/charts',
            '../components/dialogs',
            '../components/tables'
        ];

        directories.forEach(dir => {
            const dirPath = path.resolve(__dirname, dir);
            expect(fs.existsSync(dirPath)).toBe(true);

            const files = fs.readdirSync(dirPath);
            expect(files.length).toBeGreaterThan(0);
            expect(files).toContain('index.ts');
        });
    });

    test('修復統計應該符合預期', () => {
        // 統計創建的文件數量
        const chartsFiles = fs.readdirSync(path.resolve(__dirname, '../components/charts'));
        const dialogsFiles = fs.readdirSync(path.resolve(__dirname, '../components/dialogs'));
        const tablesFiles = fs.readdirSync(path.resolve(__dirname, '../components/tables'));

        // Charts: 5 個文件 (4 個組件 + 1 個 index.ts)
        expect(chartsFiles.length).toBe(5);

        // Dialogs: 5 個文件 (4 個組件 + 1 個 index.ts)
        expect(dialogsFiles.length).toBe(5);

        // Tables: 6 個文件 (5 個組件 + 1 個 index.ts)
        expect(tablesFiles.length).toBe(6);
    });
});
