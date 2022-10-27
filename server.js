const http = require('http')

const persons = [
  { id: 90, name: "Ebrahim" },
  { id: 30, name: "Komeil" },
  { id: 34, name: "Ali" },
]

const server = http.createServer((req, res) => {
  const { method, url } = req
  let body = []

  req.on('data', chunk => {
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()

    let status = 404
    const response = {
      success: false,
      data: null,
      error: null
    }

    if (method === 'GET' && url === '/persons') {
      status = 200
      response.success = true
      response.data = persons
    }
    else if (method === 'POST' && url === '/persons') {
      const { id, name } = JSON.parse(body)

      if (!id || !name) {
        status = 400
        response.error = 'add id and name'
      }
      else {
        persons.push({ id, name })
        status = 201
        response.success = true
        response.data = persons
      }
    }

    res.writeHead(status, {
      'X-Powered-By': 'Nodejs',
      'Content-Type': 'application/json'
    })

    res.end(
      JSON.stringify(response)
    )
  })
})

const PORT = 5000

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))