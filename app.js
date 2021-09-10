const http = require('http')
const { parse } = require('qs')

const { getCourseId, getCourseCreationDate } = require('./utils')
const layout = require('./layout')


const port = process.env.PORT || 3000
http.createServer(async (req, res) => {
  
  let body = ''
  let created =  ''
  if (req.method === 'POST') {

    req.on('data', function (chunk) {
      body += chunk;
    })

    req.on('end', async () => {
      const parsedReq = parse(body)
      const courseURL = parsedReq.courseURL
      
      if (!courseURL.trim().length > 0 || !courseURL.trim().includes('/course/')) {
        res.end(layout({created}))
      } else {
        const courseId = await getCourseId(courseURL)
        const creationDate = await getCourseCreationDate(courseId)
        created = new Date(creationDate).toDateString()
        
        res.writeHead(200);
        res.end(layout({created}));
      }
    })
  } else {
    res.end(layout({created}))
  }
}).listen(port)