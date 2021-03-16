const ReziDB = require('./ReziDB')

const { Buffer } = require('buffer')

const Bitray = require('bitray')

const marked = require('marked')

const fs = require('fs')

const packages = new ReziDB({
    name: 'package-database',
    path: './database/'
})

const express = require('express')

const app = express()

app.listen(3000)

app.get('/search', async (req, res) => {

    const query = req.query['query']
 
    if (query) {

        const queried = await packages.search(query.toLowerCase().trim())

        res.status(200)

        res.end(JSON.stringify(queried))

        return

    }

    res.status(200)

    res.end(JSON.stringify([]))

    return

})

app.get('/publish', async (req, res) => {

    const options = JSON.parse(req.query['data'])

    console.log(options)

    if (options.name) {
        
        await packages.set(options.name, {
            npm: `https://www.npmjs.com/package/${options.name}/`,
            github: options.repository,
            title: options.name.toLowerCase().trim(),
            keywords: options.keywords,
            description: options.description,
            license: options.license,
            version: options.version,
            readme: Buffer.from(options.readme, 'hex'),
            author: options.author
        })

    }
    
    if (!options.name || !options.version) {

        res.status(401)

        res.end('Invalid Package')

        return

    }

    res.status(200)

    res.end('Package Updated')

})

app.get('/list', async (req, res) => {

    res.end(JSON.stringify(await packages.toJSON()))

})

app.get('/info', async (req, res) => {

    res.end(JSON.stringify(await packages.get(req.query['name'] || null) || {}))

})

app.get('/readme', async (req, res) => {

    res.contentType('text/plain')

    const package = await packages.get(req.query['name'] || null)

    let readmeData = package.readme.toString()

    res.end(readmeData)

})

app.get('/readme-format', async (req, res) => {

    res.contentType('text/plain')

    const package = await packages.get(req.query['name'] || null)

    let readmeData = package.readme.toString()

    res.end(marked.parse(readmeData))

})

app.get('/', async (req, res) => {

	res.contentType('text/html')

	res.end(fs.readFileSync('./main/main.html'))

})

app.get('/rainbow.css', async (req, res) => {

	res.contentType('text/css')

	res.end(fs.readFileSync('./package/code.css'))

})

app.get('/rainbow.js', async (req, res) => {

	res.contentType('application/javascript')

	res.end(fs.readFileSync('./rainbow.min.js'))

})

app.get('/marked.js', async (req, res) => {

	res.contentType('application/javascript')

	res.end(fs.readFileSync('./marked.min.js'))

})

app.get('/package/*', async (req, res) => {

    const name = req.url.split('/package')[1].replace('/', '') || null

    console.log(name)

    if (!name || await packages.get(name) == null) {

        res.contentType('text/html')

        res.end(fs.readFileSync('./404/404.html'))

        return

    }

	res.contentType('text/html')

	res.end(fs.readFileSync('./package/package.html'))

})

app.get('/404', async (req, res) => {

	res.contentType('text/html')

	res.end(fs.readFileSync('./404/404.html'))

})

app.get('/main.css', async (req, res) => {

	res.contentType('text/css')

	res.end(fs.readFileSync('./main/main.css'))

})

app.get('/package.css', async (req, res) => {

	res.contentType('text/css')

	res.end(fs.readFileSync('./package/package.css'))

})

app.get('/404.css', async (req, res) => {

	res.contentType('text/css')

	res.end(fs.readFileSync('./404/404.css'))

})


app.get('/logo.svg', async (req, res) => {

	res.contentType('image/svg+xml')

	res.end(fs.readFileSync('./img/logo.svg'))

})

app.get('/night.jpg', async (req, res) => {

	res.contentType('image/jpg')

	res.end(fs.readFileSync('./img/night3.jpg'))

})

app.get('/npm.png', async (req, res) => {

	res.contentType('image/png')

	res.end(fs.readFileSync('./img/npm.png'))

})

app.get('/github.png', async (req, res) => {

	res.contentType('image/png')

	res.end(fs.readFileSync('./img/github.png'))

})

app.get('/jquery.min.js', async (req, res) => {

	res.contentType('text/javascript')

	res.end(fs.readFileSync('./jquery.min.js'))

})