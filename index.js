const { Client, GatewayIntentBits, Events } = require('discord.js');
// Bot tokeninizi buraya yazın
const TOKEN = 'MTMyNzc2ODY2MzMyMjkyMzE0MQ.GzX2jG.XEOYvg4vN5f1_yTcMjcsPS8MZRRqn1U9cDDb-0';

// Bot istemcisi oluşturuluyor
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
    ],
});

// Davet kodlarını depolamak için
const invites = new Map();

client.once(Events.ClientReady, async () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı.`);

    // Tüm sunucuların davetlerini depola
    client.guilds.cache.forEach(async (guild) => {
        const guildInvites = await guild.invites.fetch();
        invites.set(guild.id, guildInvites);
    });
});

// Sunucuda yeni bir üye katıldığında
client.on(Events.GuildMemberAdd, async (member) => {
    try {
        // Kalıcı hoş geldin mesajının gönderileceği kanal
        const welcomeChannelId = '1260240557708546188'; // Buraya hoş geldin kanalının ID'sini yazın
        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

        // Geçici hoş geldin mesajının gönderileceği kanal
        const tempWelcomeChannelId = '1293299849063563395'; // Sohbet kanalının ID'si
        const tempWelcomeChannel = member.guild.channels.cache.get(tempWelcomeChannelId);

        if (!welcomeChannel || !tempWelcomeChannel) {
            console.error('Kanallardan biri bulunamadı.');
            return;
        }

        // Sunucunun mevcut davetlerini al
        const newInvites = await member.guild.invites.fetch();
        const oldInvites = invites.get(member.guild.id);

        // Kimden geldiğini bul
        const inviteUsed = newInvites.find(
            (inv) =>
                oldInvites.get(inv.code)?.uses < inv.uses
        );
        invites.set(member.guild.id, newInvites);

        const inviter = inviteUsed?.inviter ? inviteUsed.inviter.tag : 'Bilinmiyor';

        // Kalıcı hoş geldin mesajı
        await welcomeChannel.send(`${member} aramıza katıldı! 🎉 Hoş geldin!

**Bu kişi, sunucumuza ${inviter} tarafından davet edildi! 🎀**
`);

        // Geçici hoş geldin mesajı
        const tempMessage = await tempWelcomeChannel.send(`
${member} Raishi'ye hoş geldin 🎀

**Sunucumuz hakkında bilgi almak istiyorsan alttaki kanallara göz atabilirsin 🌺**

**⊱** <#1249049007498596453> 
**⊱** <#1249049025043370166> 
**⊱** <#1249049005552566302> 
**⊱** <#1249049025043370166> 

**Onun dışında tek yapman rahatına bakıp sohbete karışman! 🌊**`);

        // 30 saniye sonra mesajı sil
        setTimeout(() => {
            tempMessage.delete().catch(console.error);
        }, 30000);
    } catch (error) {
        console.error('Hoş geldin mesajı gönderilirken hata oluştu:', error);
    }
});

// Sunucudan ayrılma olayını dinleme
client.on(Events.GuildMemberRemove, async (member) => {
    try {
        // Ayrılma mesajının gönderileceği kanal
        const goodbyeChannelId = '1260240557708546188'; // Çıkış mesajını hoş geldin kanalına gönderiyoruz
        const channel = member.guild.channels.cache.get(goodbyeChannelId);

        if (!channel) {
            console.error('Çıkış kanalı bulunamadı.');
            return;
        }

        // Ayrılma mesajı
        await channel.send(`${member.user.tag} aramızdan ayrıldı. Umarız tekrar görüşürüz! 🌙`);
    } catch (error) {
        console.error('Çıkış mesajı gönderilirken hata oluştu:', error);
    }
});

// Botu başlat
client.login('MTMyNzc2ODY2MzMyMjkyMzE0MQ.GzX2jG.XEOYvg4vN5f1_yTcMjcsPS8MZRRqn1U9cDDb-0');