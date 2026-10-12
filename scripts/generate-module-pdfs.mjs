import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import PDFDocument from 'pdfkit'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const rootDirectory = path.resolve(scriptDirectory, '..')
const outputDirectory = path.join(rootDirectory, 'public', 'module-guides')
const guidePath = path.join(rootDirectory, 'src', 'data', 'module-guides.json')
const modules = JSON.parse(fs.readFileSync(guidePath, 'utf8'))

function generatePdf(module) {
  const outputPath = path.join(outputDirectory, `module-${module.number}-${module.slug}.pdf`)
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 62, bottom: 56, left: 58, right: 58 },
    bufferPages: true,
    info: {
      Title: `Module ${module.number}: ${module.title}`,
      Author: 'Data Science Subject Laboratory',
      Subject: 'Six-page module learning and presentation guide',
    },
  })
  const outputStream = fs.createWriteStream(outputPath)
  const finished = new Promise((resolve, reject) => {
    outputStream.once('finish', resolve)
    outputStream.once('error', reject)
  })
  doc.pipe(outputStream)

  module.pages.forEach((page, pageIndex) => {
    if (pageIndex > 0) doc.addPage()

    doc.rect(0, 0, doc.page.width, 14).fill('#0EA5A8')
    doc.fillColor('#0B1F3A').font('Helvetica-Bold').fontSize(9)
      .text(`DATA SCIENCE SUBJECT LABORATORY  |  MODULE ${String(module.number).padStart(2, '0')}`, 58, 38)
    doc.moveDown(1.3)
    doc.fillColor('#0EA5A8').font('Helvetica-Bold').fontSize(10)
      .text(`PRESENTATION MATTER  ·  PAGE ${pageIndex + 1} OF ${module.pages.length}`)
    doc.moveDown(0.6)
    doc.fillColor('#0B1F3A').font('Helvetica-Bold').fontSize(23)
      .text(page.title, { lineGap: 4 })
    doc.moveDown(1)

    for (const paragraph of page.paragraphs) {
      doc.fillColor('#263445').font('Helvetica').fontSize(11)
        .text(paragraph, { lineGap: 5, paragraphGap: 8, width: doc.page.width - 116 })
      doc.moveDown(0.65)
    }

    doc.moveDown(0.4)
    doc.fillColor('#0B1F3A').font('Helvetica-Bold').fontSize(12).text('Key points')
    doc.moveDown(0.45)
    for (const bullet of page.bullets) {
      doc.fillColor('#263445').font('Helvetica').fontSize(10.5)
        .list([bullet], { bulletIndent: 10, textIndent: 18, lineGap: 4 })
      doc.moveDown(0.4)
    }

    doc.font('Helvetica').fontSize(8).fillColor('#64748B')
      .text('Academic Year 2026–2027  ·  Draft learning guide for classroom presentation and study', 58, doc.page.height - 75, {
        width: doc.page.width - 116,
        align: 'center',
      })
  })

  doc.end()
  return finished.then(() => outputPath)
}

fs.mkdirSync(outputDirectory, { recursive: true })
const outputs = await Promise.all(modules.map(generatePdf))
console.log(`Generated ${outputs.length} six-page module guides in ${outputDirectory}`)
