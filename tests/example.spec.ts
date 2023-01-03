import { test, expect } from '@playwright/test';
import { Guid } from "guid-typescript";

test('put html tag in all user and team input fields', async ({ page }) => {
    await page.goto('https://c.hr.dmerej.info/');
    await page.getByRole('link', { name: 'Add new employee' }).click();
    const guid = Guid.create().toString();
    await page.getByPlaceholder('Name').fill('<b>' + guid + '</b>');
    await page.getByPlaceholder('Email').fill('john.doe@mail.com');
    await page.locator('#id_address_line1').fill('<b>1 rue de la Paix</b>');
    await page.getByPlaceholder('City').fill('<b>Paris</b>');
    await page.getByPlaceholder('Zip code').click();
    await page.getByPlaceholder('Zip code').fill('75001');
    await page.getByPlaceholder('Hiring date').fill('1996-04-20');
    await page.getByPlaceholder('Job title').click();
    await page.getByPlaceholder('Job title').fill('<b>Employee</b>');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByRole('link', { name: 'List Employees' }).click();
    await page.getByRole('row', { name: '<b>' + guid + '</b> john.doe@mail.com no Edit Delete' }).getByRole('link', { name: 'Edit' }).click();
    await expect(page.locator('body > *:nth-child(3)')).toHaveText('<b>' + guid + '</b> - john.doe@mail.com');
    await expect(page.locator('body > *:nth-child(4)')).toHaveText('<b>Employee</b>');
});