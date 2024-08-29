import express from 'express';
import puppeteer from 'puppeteer';
import { Request, Response } from 'express';
const cors = require('cors');

const app = express();
const port = 3101;

app.use(cors());
app.use(express.json());

const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, buffer?: Buffer) => {
    if (!success) {
        res.status(statusCode).json({
            success,
            message,
        });
    } else if (buffer) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=report.pdf`);
        res.send(buffer);
    }
};

app.post('/evaluation/report', async (req: Request, res: Response) => {
    try {
        if (!req.body.url) {
            return sendResponse(res, 400, false, "URL and directory are required.");
        }
        
        console.log(req.body.url);
        console.log(req.body.schoolName);

        const schoolName = req.body.schoolName || 'Unknown School';
        const browser = await puppeteer.launch({ headless: true, ignoreHTTPSErrors: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();      
        await page.goto(req.body.url, { waitUntil: 'networkidle2' });
        await page.setExtraHTTPHeaders({
            'font-family': 'Arial, sans-serif'
        });
        await page.waitForTimeout(10000);
        // generate PDF from the page content
        const buffer = await page.pdf({ 
            format: "A4", 
            margin: {
                top: '50px',
                bottom: '60px',
                left: '25px',
                right: '50px'
              },
            printBackground: true,
            displayHeaderFooter: true, 
            headerTemplate: "<div></div>", 
            footerTemplate: `<div style="text-align: right;width: 297mm;font-size: 10px;">
                                <span style="float: left; margin-left: 1cm;">${schoolName}</span>
                                <span style="margin-right: 1cm;"><span class="pageNumber"></span> of <span class="totalPages"></span></span>
                             </div>`
        });
        // close the browser
        await browser.close();     
        sendResponse(res, 200, true, "PDF generated successfully.", buffer);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, false, "Internal server error.");
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
