const puppeteer = require('puppeteer');
const chalk = require('chalk');

const URL =
	'https://www.codewars.com/kata/search/javascript?order_by=rank_id+asc&q=&r=-8&tags=Fundamentals';

async function launch() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(URL, { waitUntil: 'networkidle2' });
	const total = await page.evaluate(() => {
		const element = document.querySelector('.mlx.mtn.is-gray-text');
		const total = element.textContent.split(' ')[0];
		return total;
	});
	const pages = Math.ceil(total / 30);
	const randomPage = random(0, pages);
	const url = `${URL}&page=${randomPage}`;
	await page.goto(url, { waitUntil: 'networkidle2' });
	const contents = await page.evaluate(() => {
		const jsButtons = document.querySelectorAll('[data-language="javascript"]');
		return Array.from(jsButtons).map(button => button.href);
	});
	const randomTrain = random(0, contents.length - 1);
	await page.goto(contents[randomTrain], { waitUntil: 'networkidle2' });
	const description = await page.evaluate(() => {
		const description = document.querySelector('.markdown').innerHTML;
		return description;
	});
	const pattern = /<[^>]+>/g;
	console.log(chalk.bgRed(' Question: '));
	console.log();
	console.log(
		chalk.green(description.replace(pattern, '').replace(/&gt;/g, '>'))
	);
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

launch();
