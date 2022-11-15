const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();
client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);
    if (msg.body === 'Hola Conchibot' || msg.body === '0') {
        // Send a new message as a reply to the current one
        const contact = await msg.getContact();
        const chat = await msg.getChat();
        chat.sendMessage(`Hi @${contact.number}! soy Conchibot un servicio automatizado para la contestación de mensajes:\nEliga la opción que quiera consultar:\n1. Consulta de información de las conchitas\n2. Consulta de fechas\n3. Atención a cliente`, { mentions: [contact]});
        msg.react('👍');
    } 
    else if(msg.body === '1'){
        msg.reply("Haz seleccionado la opción 1\nDe cual conchita deseas consultar información:\nA. Conchita Uno\nB. Conchita dos\nC. Conchita tres\nD. Conchita cuatro\n0. Regresa al menu principal")
    }else if(msg.body === '2'){
        msg.reply("Por favor ingrese en sl siguiente formato (DD/MM/AAAA) su fecha de inicio de estadia y después en otro mensaje envie en el mismo formato la fecha de finalización de su hospedaje\n\n0. Regresa al menu principal")
    }else if(msg.body === '3'){
        msg.reply("Haz seleccionado la opción 3\nEsper un momento mientra le colocamos un asesor de calidad\n\n0. Regresa al menu principal")
    }else if(msg.body === 'A'){
        msg.reply("La conchita A se encuentra ubicada en:\nCon un precio de habitación vigente hasta 00/00/0000\n\n\n0. Regresa al menu principal")
    }else if(msg.body === 'B'){
        msg.reply("La conchita B se encuentra ubicada en:\nCon un precio de habitación vigente hasta 00/00/0000\n\n\n0. Regresa al menu principal")
    }else if(msg.body === 'C'){
        msg.reply("La conchita D se encuentra ubicada en:\nCon un precio de habitación vigente hasta 00/00/0000\n\n\n0. Regresa al menu principal")
    }else if(msg.body === 'D'){
        msg.reply("La conchita D se encuentra ubicada en:\nCon un precio de habitación vigente hasta 00/00/0000\n\n\n0. Regresa al menu principal")
    }


    else if (msg.body === '!ping') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'pong');

    } else if (msg.body.startsWith('!sendto')) {
        // Direct send a new message to specific id
        let number = msg.body.split(' ')[1];
        let messageIndex = msg.body.indexOf(number) + number.length;
        let message = msg.body.slice(messageIndex, msg.body.length);
        number = number.includes('@c.us') ? number : `${number}@c.us`;
        let chat = await msg.getChat();
        chat.sendSeen();
        client.sendMessage(number, message);

    } else if (msg.body.startsWith('!subject')) {
        // Change the group subject
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newSubject = msg.body.slice(9);
            chat.setSubject(newSubject);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body.startsWith('!echo')) {
        // Replies with the same message
        msg.reply(msg.body.slice(6));
    } else if (msg.body.startsWith('!desc')) {
        // Change the group description
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newDescription = msg.body.slice(6);
            chat.setDescription(newDescription);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body === '!leave') {
        // Leave the group
        let chat = await msg.getChat();
        if (chat.isGroup) {
            chat.leave();
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body.startsWith('!join')) {
        const inviteCode = msg.body.split(' ')[1];
        try {
            await client.acceptInvite(inviteCode);
            msg.reply('Joined the group!');
        } catch (e) {
            msg.reply('That invite code seems to be invalid.');
        }
    } else if (msg.body === '!groupinfo') {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply(`
                *Group Details*
                Name: ${chat.name}
                Description: ${chat.description}
                Created At: ${chat.createdAt.toString()}
                Created By: ${chat.owner.user}
                Participant count: ${chat.participants.length}
            `);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body === '!chats') {
        const chats = await client.getChats();
        client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
    } else if (msg.body === '!info') {
        let info = client.info;
        client.sendMessage(msg.from, `
            *Connection info*
            User name: ${info.pushname}
            My number: ${info.wid.user}
            Platform: ${info.platform}
        `);
    } else if (msg.body === '!mediainfo' && msg.hasMedia) {
        const attachmentData = await msg.downloadMedia();
        msg.reply(`
            *Media info*
            MimeType: ${attachmentData.mimetype}
            Filename: ${attachmentData.filename}
            Data (length): ${attachmentData.data.length}
        `);
    } else if (msg.body === '!quoteinfo' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();

        quotedMsg.reply(`
            ID: ${quotedMsg.id._serialized}
            Type: ${quotedMsg.type}
            Author: ${quotedMsg.author || quotedMsg.from}
            Timestamp: ${quotedMsg.timestamp}
            Has Media? ${quotedMsg.hasMedia}
        `);
    } else if (msg.body === '!resendmedia' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            const attachmentData = await quotedMsg.downloadMedia();
            client.sendMessage(msg.from, attachmentData, { caption: 'Here\'s your requested media.' });
        }
    } else if (msg.body === '!location') {
        msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
    } else if (msg.location) {
        msg.reply(msg.location);
    } 
    // else if (msg.body.startsWith('!status')) {
    //     const newStatus = msg.body.split(' ')[1];
    //     await client.setStatus(newStatus);
    //     msg.reply(`Status was updated to *${newStatus}*`);
    // } 
    else if (msg.body === '!mention') {
        const contact = await msg.getContact();
        const chat = await msg.getChat();
        chat.sendMessage(`Hi @${contact.number}!`, {
            mentions: [contact]
        });
    } 
    else if (msg.body === '!delete') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.delete(true);
            } else {
                msg.reply('I can only delete my own messages');
            }
        }
    }
    else if (msg.body === '!pin') {
        const chat = await msg.getChat();
        await chat.pin();
    } 
    
    else if (msg.body === '!archive') {
        const chat = await msg.getChat();
        await chat.archive();
    }
    // else if (msg.body === '!mute') {
    //     const chat = await msg.getChat();
    //     // mute the chat for 20 seconds
    //     const unmuteDate = new Date();
    //     unmuteDate.setSeconds(unmuteDate.getSeconds() + 20);
    //     await chat.mute(unmuteDate);
    // } 
    else if (msg.body === '!typing') {//hace como que escribe pero no envia nada
        const chat = await msg.getChat();
        // simulates typing in the chat
        chat.sendStateTyping();
    } 
    else if (msg.body === '!recording') { // hace como que graba algo 
        const chat = await msg.getChat();
        // simulates recording audio in the chat
        chat.sendStateRecording();
    } 
    else if (msg.body === '!clearstate') { // 
        const chat = await msg.getChat();
        // stops typing or recording in the chat
        chat.clearState();
    } 
    // else if (msg.body === '!jumpto') {
    //     if (msg.hasQuotedMsg) {
    //         const quotedMsg = await msg.getQuotedMessage();
    //         client.interface.openChatWindowAt(quotedMsg.id._serialized);
    //     }
    // } 
    // else if (msg.body === '!buttons') {
    //     let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
    //     client.sendMessage(msg.from, button);
    // } 
    // else if (msg.body === '!list') {
    //     let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
    //     let list = new List('List body','btnText',sections,'Title','footer');
    //     client.sendMessage(msg.from, list);
    // } 
    else if (msg.body === '!reaction') {
        msg.react('👍');
    }else{
        msg.reply('Valor invalido por favor intentalo de nuevo')
    }
});