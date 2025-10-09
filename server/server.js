import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// 中间件
app.use(cors())
app.use(express.json())

// 数据目录
const DATA_DIR = path.join(__dirname, 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }

  try {
    await fs.access(USERS_FILE)
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify({}))
  }
}

// 读取所有用户数据
async function readUsers() {
  const data = await fs.readFile(USERS_FILE, 'utf-8')
  return JSON.parse(data)
}

// 写入用户数据
async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

// 登录接口
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }

    const users = await readUsers()

    // 如果用户不存在，自动注册
    if (!users[username]) {
      users[username] = {
        password,
        words: [],
        createdAt: new Date().toISOString()
      }
      await writeUsers(users)
      return res.json({
        success: true,
        message: '注册成功',
        username,
        words: []
      })
    }

    // 验证密码
    if (users[username].password !== password) {
      return res.status(401).json({ error: '密码错误' })
    }

    res.json({
      success: true,
      message: '登录成功',
      username,
      words: users[username].words || []
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 获取用户单词数据
app.get('/api/words/:username', async (req, res) => {
  try {
    const { username } = req.params
    const users = await readUsers()

    if (!users[username]) {
      return res.status(404).json({ error: '用户不存在' })
    }

    res.json({ words: users[username].words || [] })
  } catch (error) {
    console.error('获取单词错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 保存用户单词数据
app.post('/api/words/:username', async (req, res) => {
  try {
    const { username } = req.params
    const { words } = req.body

    const users = await readUsers()

    if (!users[username]) {
      return res.status(404).json({ error: '用户不存在' })
    }

    users[username].words = words
    users[username].lastUpdated = new Date().toISOString()
    await writeUsers(users)

    res.json({ success: true, message: '保存成功' })
  } catch (error) {
    console.error('保存单词错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 启动服务器
async function startServer() {
  await ensureDataDir()
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  })
}

startServer()

