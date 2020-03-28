registerPlugin({
    name: 'AntiAbuse',
    version: '1.0',
    description: 'Prevents abuse from admins | Set max amount of actions in given time.',
    author: 'devdanetra <devdanetra@outlook.com>',
    vars: [
    {
        name: "excludedGroup",
        type: "number",
        title: "Excluded server Group",
    },
    {
        name: "maxChannelAmount",
        type: "number",
        title: "How many channels can someone delete in given time?",
    },
    {
        name: "channelCheckTime",
        type: "number",
        title: "Time in seconds for channel delete option.",
    },
    {
        name: "maxBanAmount",
        type: "number",
        title: "How many clients can someone ban in given time?",
    },
    {
        name: "banCheckTime",
        type: "number",
        title: "Time in seconds for bans option.",
    },
    {
        name: "maxKickAmount",
        type: "number",
        title: "How many clients can someone kick in given time?",
    },
    {
        name: "kickCheckTime",
        type: "number",
        title: "Time in seconds for channel kick option.",
    },
    {
        name: "banTime",
        type: "number",
        title: "How much should a client get banned? (-1 = permanent)",
    },
    {
        name: "banReason",
        type: "string",
        title: "Insert the reason.",
        default: "Admin abuse : too many bans.",
    },
    {
        name: "kickReason",
        type: "string",
        title: "Insert the reason.",
        default: "Admin abuse : too many kicks.",
    },
    {
        name: "channelReason",
        type: "string",
        title: "Insert the reason.",
        default: "Admin abuse : too many channels deleted.",
    },
	],
}, function(sinusbot, config) {
	
	const engine = require('engine');
	const store = require('store');
	const backend = require('backend');
	const helpers = require('helpers');
	const format = require('format');
	var event = require('event');
    
    setInterval(removeBanCount,config.banCheckTime *1000);
    setInterval(removeKickCount,config.kickCheckTime *1000);
    setInterval(removeChannelCount,config.channelCheckTime *1000);
    
    
    function removeBanCount(){
        
        var clients = backend.getClients();
        engine.log("resetting ban count!");
        clients.forEach(function(client) {
            let uid = client.uid();
            let banCount = uid + "banCount";
            store.unset(banCount);
        });
        
        
        
    }
    
        function removeKickCount(){

        var clients = backend.getClients();
        engine.log("resetting kick count!");
        
        clients.forEach(function(client) {
            let uid = client.uid();
            let kickCount = uid + "kickCount";
            store.unset(kickCount);
        });
    }
    
        function removeChannelCount(){
        
        var clients = backend.getClients();
        engine.log("resetting channel count!");
        
        clients.forEach(function(client) {
            let uid = client.uid();
            let channelCount = uid + "channelCount";
            store.unset(channelCount);
        });   
    }
    
    event.on('clientBanned', function(ev) {
        
        let invoker = ev.invoker;
        let uid = invoker.uid();
        let banCount = uid + "banCount";   
        
        if(store.get(banCount) > config.maxBanAmount)
            banPlayer(invoker,config.banReason);
        let count = store.get(banCount);
        count++;
        store.set(banCount,count);
        return;   
        
        });
             
    event.on('clientKicked', function(ev) {
        
        if(ev.invoker.isSelf())
            return;
        
        let invoker = ev.invoker;
        let uid = invoker.uid();
        let kickCount = uid + "kickCount";
        
        if(store.get(kickCount) > config.maxKickAmount)
            banPlayer(invoker,config.kickReason);
        let count = store.get(kickCount);
        count++;
        store.set(kickCount,count);
        
        return;
        
        });
    
    
    event.on('channelDelete', function(ev,invoker) {
        
        if(invoker.isSelf())
            return;
        
        let uid = invoker.uid();
        let channelCount = uid + "channelCount";
        
        if(store.get(channelCount) > config.maxChannelAmount)
            banPlayer(invoker,config.channelReason);
        let count = store.get(channelCount);
        count++;
        store.set(channelCount,count);
        return;
        });
             
             
    function banPlayer(client,reason){
        let clientGroups = client.getServerGroups();
        let excludedGroup = backend.getServerGroupByID(config.excludedGroup);   
        let ban = true;
        
        clientGroups.forEach(function(group) {
            if(group == excludedGroup){
                ban = false;
                engine.log("Excluded " + client.name() + " detected : NOT BANNING.");
            }
        });
        if(ban){                     
            engine.log("banning " + client.name() + " for abuse.");
            clientGroups.forEach(element => client.removeFromServerGroup(element));
            client.ban(config.banTime*1000,reason);
        }
    }
});


