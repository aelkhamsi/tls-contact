import { sendEmail } from './mailer.js'; 
import playwright from 'playwright';
import dotenv from 'dotenv';
dotenv.config();

async function getPage(browser) {
  console.log('------------------------------');
  console.log('Opening TLS Contact...');
  const page = await browser.newPage();
  await page.goto(process.env.TLS_URL);
  return page;
}

async function login(page) {
  console.log('Login...')
  await page.getByText('SE CONNECTER').click();
  await page.waitForLoadState('networkidle')
  await page.getByLabel('Email').fill(process.env.TLS_EMAIL);
  await page.getByLabel('Password').fill(process.env.TLS_PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForLoadState('networkidle')
}

async function checkAppointement(page) {
  console.log('Check Appointement...');
  await new Promise(r => setTimeout(r, 2000));
  await page.getByText('VOIR LE GROUPE').click();
  await page.waitForLoadState('networkidle');
  await new Promise(r => setTimeout(r, 6000));
  
  await page.getByRole('button', { name: 'Prendre rendez-vous' }).click();
  await page.waitForLoadState('networkidle');
  await new Promise(r => setTimeout(r, 10000));
  
  let availableSlots = 0;
  for (const _ of await page.locator(`xpath=//button[contains(@class, '-available')]`).all()) {
    availableSlots += 1;
  }
  console.log('Available Slots: ', availableSlots);

  if (availableSlots) {
    // Send Email
    console.log('Sending Email...');
    sendEmail();
  } else {
    throw new Error('No available slots found');
  }
}

async function main() {
  const browser = await playwright.chromium.launch({headless: false});
  
  try {  
    const page = await getPage(browser);
    await login(page);
    await checkAppointement(page);
    await browser.close();
  } catch(e) {
    
    browser.close()
    if (e.message === 'No available slots found') {
      await new Promise(r => setTimeout(r, 180000));
    } else {
      console.log('error: ', e.message)
      await new Promise(r => setTimeout(r, 2000));
    }
    main()
  }
}

main()