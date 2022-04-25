const PORT = 4000

const express = require('express')
const app = express()

const morgan = require('morgan')
app.use(morgan('tiny'))
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.redirect('/index.html')
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
