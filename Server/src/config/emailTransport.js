import nodemailer from 'nodemailer'
import { GMAIL_ACCOUNT, GMAIL_PASSWORD } from './config.js'

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: GMAIL_ACCOUNT,
        pass: GMAIL_PASSWORD
    }
})

export default transport