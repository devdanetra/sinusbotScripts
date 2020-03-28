registerPlugin({
    name: 'FACEIT Script',
    version: '1.0',
    description: 'FACEIT Stats,tracking,matches info etc. (!faceit or !f)',
    author: 'devdanetra@outlook.com',
	requiredModules: ["http"],
    vars: [
    {
        name: "iNeedAnArgument",
        type: "string",
        title: "Tip message without an argument.",
        placeholder: "I need an argument to work! Type [b]!faceit help[/b] to get an overview.",
        default: "I need an argument to work! Type [b]!faceit help[/b] to get an overview.",
    },
	{
        name: "successfullySyncMessage",
        type: "string",
        title: "Your custom message. (%fname% indicates user name)",
        placeholder: "Account [b]%fname%[/b] ✅ successfully synced.",
        default: "Account [b]%fname%[/b] ✅ succesfully synced.",
    },
	{
        name: "afterSyncMessage",
        type: "string",
        title: "Tip message after syncing.",
        placeholder: "Type [b]!faceit track[/b] to start tracking your level.",
        default: "Type [b]!faceit track[/b] to start tracking your level.",
    },
    {
        name: "unsyncMessage",
        type: "string",
        title: "Your custom message. (%fname% indicates user name)",
        placeholder: "Account [b]%fname%[/b] ✅  successfully unsynced.",
        default: "Account [b]%fname%[/b] ✅ succesfully unsynced.",
    },
    {
        name: "userNotExisting",
        type: "string",
        title: "Message if User does not exists on FACEIT systems.",
        placeholder: "[b]%fname%[/b] does not exist on FACEIT.",
        default: "[b]%fname%[/b] does not exist on FACEIT.",
    },
    {
        name: "userNotSet",
        type: "string",
        title: "Message an user gets when his account has not been synced yet (part1).",
        placeholder: "You have not synced a faceit account yet.",
        default: "You have not synced a faceit account yet.",
    },   
    {
        name: "youNeedToSync",
        type: "string",
        title: "Message an user gets when his account has not been synced yet (part2).",
        placeholder: "Type [b]!faceit setuser <name>[/b] to sync your account.",
        default: "Type [b]!faceit setuser <name>[/b] to sync your account.",
    }, 
    {
        name: "alreadyTracking",
        type: "string",
        title: "Your custom message. (%fname% indicates user name)",
        placeholder: "Already tracking account [b]%fname%[/b].",
        default: "Already tracking account [b]%fname%[/b].",
    },
    {
        name: "alreadyNotTracking",
        type: "string",
        title: "Your custom message. (%fname% indicates user name)",
        placeholder: "Already Not tracking account [b]%fname%[/b].",
        default: "Already Not tracking account [b]%fname%[/b].",
    },
    {
        name: "startTracking",
        type: "string",
        title: "Your custom message. (%fname% indicates user name)",
        placeholder: "Started tracking account [b]%fname%[/b].",
        default: "Started tracking account [b]%fname%[/b].",
    },    
    {
        name: "stopTracking",
        type: "string",
        title: "Your custom message. (%fname% indicates user name)",
        placeholder: "Stopped tracking account [b]%fname%[/b].",
        default: "Stopped tracking account [b]%fname%[/b].",
    },
    {
        name: "levelDownMessage",
        type: "string",
        title: "Message an user gets leveledDown.",
        placeholder: "%fname% you are now at level [b]%level%[/b]. Don't worry you can do this.",
        default: "%fname% you are now at level [b]%level%[/b]. Don't worry you can do this.",
    }, 
    {
        name: "levelUpMessage",
        type: "string",
        title: "Message an user gets leveledUp.",
        placeholder: "%fname% you are now at level[b]%level%[/b]. Congratulations.",
        default: "%fname% you are now at level[b]%level%[/b]. Congratulations.",
    }, 
    {
        name: "accountStatsMessage1",
        type: "string",
        title: "Shows account info (part1).",
        placeholder: "[%nickname% | %country% ]  ★ %membership% Membership",
        default: "[%nickname% | %country% ]  ★ %membership% Membership",
    }, 
    {
        name: "accountStatsMessage2",
        type: "string",
        title: "Shows account info (part2).",
        placeholder: "%region% |Level [%level%] | ELO [%elo%]",
        default: "%region% |Level [%level%] | ELO [%elo%]",
    }, 
    {
        name: "accountStatsMessage3",
        type: "string",
        title: "Shows account info (part3).",
        placeholder: "[url=%url%]profile[/url]",
        default: "[url=%url%]profile[/url]",
    }, 
	{
		name: "updateSeconds",
        title: 'Insert update time in seconds',
        type: 'number',
		default: "120",
    },
    {
        name: "level1",
        type: "number",
        title: "Your custom groupID for level 1.",
    },
    {
        name: "level2",
        type: "number",
        title: "Your custom groupID for level 2.",
    },
    {
        name: "level3",
        type: "number",
        title: "Your custom groupID for level 3.",
    },
    {
        name: "level4",
        type: "number",
        title: "Your custom groupID for level 4.",
    },
    {
        name: "level5",
        type: "number",
        title: "Your custom groupID for level 5.",
    },
    {
        name: "level6",
        type: "number",
        title: "Your custom groupID for level 6.",
    },
    {
        name: "level7",
        type: "number",
        title: "Your custom groupID for level 7.",
    },
    {
        name: "level8",
        type: "number",
        title: "Your custom groupID for level 8.",
    },
    {
        name: "level9",
        type: "number",
        title: "Your custom groupID for level 9.",
    },
    {
        name: "level10",
        type: "number",
        title: "Your custom groupID for level 10.",
    }, 
    {
		name: "apiKey",
        title: 'Insert APIKEY',
        type: 'string',
		default: "",
    },
	],
}, function(sinusbot, config) {
	
	const engine = require('engine');
	const store = require('store');
	const backend = require('backend');
	const helpers = require('helpers');
	const format = require('format');
	const http = require('http');
	var event = require('event');
    
    setInterval(updateLevel,config.updateSeconds *1000);
    
    function updateLevel(){
        var clients = backend.getClients();

        clients.forEach(function(client) {
            
            let id = client.uid();
            let hasSetUser = id + "hasSetUser";
            let userValue = id + "userValue";
            let hasEnabledTracking = id + "hasEnabledTracking";
            let latestRank = id + "latestRank";
            
            if(store.get(hasSetUser) && store.get(hasEnabledTracking)){
                name = store.get(userValue);
                
                let url = "https://open.faceit.com/data/v4/players?nickname=" + name + "&game=csgo";
        
                http.simpleRequest({
                'method': 'GET',
                'url': url,
                'timeout': 6000,
                'headers': {
                    'Authorization': 'bearer ' + config.apiKey,
                    }
                }, function (error, response) {
                    if (error) {
                        engine.log("Error: " + error);
                        return;
                    }

                    if (response.statusCode != 200) {
                        engine.log("HTTP Error: " + response.status);
                        switch(response.statusCode){
                
                            case 404:
                                let userNotExisting = config.userNotExisting;
                                userNotExisting = userNotExisting.replace("%fname%",name)
                                client.chat("\n     " + userNotExisting);
                                break;
                            case 401:
                                client.chat("\n     " + config.apiKey + " apikey not working.");
                                break;
                            case 503:
                                client.chat("\n     " + "FaceIT is currently DOWN.");
                                 break;
                        }
                return;
                
            }
        
            var result = JSON.parse(response.data);
                    
                    
            var level1 = config.level1;
            var level2 = config.level2;
            var level3 = config.level3;
            var level4 = config.level4;
            var level5 = config.level5;
            var level6 = config.level6;
            var level7 = config.level7;
            var level8 = config.level8;
            var level9 = config.level9;
            var level10 = config.level10;
            
            engine.log("[FACEIT CSGO SCRIPT] Succesfull response for player " +       result.nickname );
            var level = result.games.csgo.skill_level;
            var previousLevel = store.get(latestRank);
            var newLevel;
                  
            switch(level){
                    
                case 1:
                    newLevel = level1;
                    break;
                case 2:
                    newLevel = level2;
                    break;
                case 3:
                    newLevel = level3;
                    break;
                case 4:
                    newLevel = level4;
                    break;
                case 5:
                    newLevel = level5;
                    break;
                case 6:
                    newLevel = level6;
                    break;
                case 7:
                    newLevel = level7;
                    break;
                case 8:
                    newLevel = level8;
                    break;
                case 9:
                    newLevel = level9;
                    break;
                case 10:
                    newLevel = level10;
                    break;
                default:
            }
                    
            if(previousLevel == newLevel) return;
                client.removeFromServerGroup(previousLevel);
                client.addToServerGroup(newLevel);
                store.set(latestRank,newLevel);
            if(previousLevel < newLevel){
                let levelUpMessage = config.levelUpMessage;
                levelUpMessage = levelUpMessage.replace("%fname%",store.get(userValue));
                levelUpMessage = levelUpMessage.replace("%level%",level);
                client.chat("\n     " + levelUpMessage);
                sendUserStats(client,store.get(userValue));
            }else{       
                let levelDownMessage = config.levelDownMessage;
                levelDownMessage = levelDownMessage.replace("%fname%",store.get(userValue));
                levelDownMessage = levelDownMessage.replace("%level%",level);
                client.chat("\n     " + levelDownMessage);
                sendUserStats(client,store.get(userValue));
            }
                    
            return;
        });    
                
                
                
                
            }
            
            return;
            
            
        });
        
        
        
        
        
        
        
        
        
        
        
    }
    
    
    
    event.on('chat', function(ev) {		
        
        let message = ev.text.split(" ");
        let command = message[0].toLowerCase();
        let client = ev.client;
        var uid = client.uid();
        
        if(command.startsWith("!faceit") || command.startsWith("!f")){
            
            if(message == "!faceit" || message == "!f"){
                
                client.chat("\n     " + config.iNeedAnArgument);
                
            }else{
                var hasSetUser = uid + "hasSetUser";
                var userValue = uid + "userValue";
                var hasEnabledTracking = uid + "hasEnabledTracking";
                var latestRank = uid + "latestRank";
                
                switch(message[1]){
                    case "help":  //done
                        client.chat("\n     " + config.helpMessage);
                        break;
                    case "setuser":
                        setUser(client, message[2]);
                        break;
                    case "unsetuser":
                        unsetUser(client);
                        break;
                     case "me":
                        if(store.get(hasSetUser)){
                            sendUserStats(client, store.get(userValue));
                        }else{
                            client.chat("\n     " + config.userNotSet);
                            client.chat("\n     " + config.youNeedToSync);
                        }
                        break;
                    case "track":
                        if(store.get(hasSetUser)){
                            
                            if(store.get(hasEnabledTracking) == false){
                                let startTracking = config.startTracking;
                                startTracking = startTracking.replace("%fname%",store.get(userValue));
                                store.set(hasEnabledTracking,true);
                                store.set(latestRank,0);
                                client.chat("\n     " + startTracking);
                                updateLevel();
                            }else{ 
                                let alreadyTracking = config.alreadyTracking;
                                alreadyTracking = alreadyTracking.replace("%fname%",store.get(userValue));
                                client.chat("\n     " + alreadyTracking);
                            }
                        }else{
                            client.chat("\n     " + config.userNotSet);
                            client.chat("\n     " + config.youNeedToSync);
                        }
                        break;
                    case "untrack":
                        if(store.get(hasSetUser)){
                            
                            if(store.get(hasEnabledTracking) == true){
                                let stopTracking = config.stopTracking;
                                stopTracking = stopTracking.replace("%fname%",store.get(userValue));
                                store.set(hasEnabledTracking,false);
                                client.removeFromServerGroup(store.get(latestRank));
                                store.unset(latestRank);
                                client.chat("\n     " + stopTracking);
                            }else{ 
                                let alreadyNotTracking = config.alreadyNotTracking;
                                alreadyNotTracking = alreadyNotTracking.replace("%fname%",store.get(userValue));
                                client.chat("\n     " + alreadyNotTracking);
                            }
                        }else{
                            client.chat("\n     " + config.userNotSet);
                            client.chat("\n     " + config.youNeedToSync);
                        }
                        break;
                    //case "setteam":
                        //setTeam(client, message[2]);
                        //break;
                    //case "unsetteam":
                        //unsetTeam(client);
                        //break;
                    case "stats": //done
                        sendUserStats(client, message[2]);
                        break;
                    //case "admin":
                        //adminCommand(); //TO DO LATER
                        //break;
                        
                }
                
                
            }
            
            
            return;
            
            
        }
        
        
        
	
	});

    
    
    function sendUserStats(client, name){ //CHECKED
        
        let url = "https://open.faceit.com/data/v4/players?nickname=" + name + "&game=csgo";
        
        http.simpleRequest({
        'method': 'GET',
        'url': url,
        'timeout': 6000,
        'headers': {
            'Authorization': 'bearer ' + config.apiKey,
            }
        }, function (error, response) {
            if (error) {
                engine.log("Error: " + error);
                return;
            }
            
            if (response.statusCode != 200) {
                engine.log("HTTP Error: " + response.status);
                switch(response.statusCode){
                    
                    case 404:
                        let userNotExisting = config.userNotExisting;
                        userNotExisting = userNotExisting.replace("%fname%",name)
                        client.chat("\n     " + userNotExisting);
                        break;
                    case 401:
                        client.chat("\n     " + config.apiKey + " apikey not working.");
                        break;
                    case 503:
                        client.chat("\n     " + "FaceIT is currently DOWN.");
                        break;
                    
                }
                return;
                
            }
        
            var result = JSON.parse(response.data);
            
            engine.log("[FACEIT CSGO SCRIPT] Succesfull response for player " +       result.nickname );

            let message1 = config.accountStatsMessage1;
            let message2 = config.accountStatsMessage2;
            let message3 = config.accountStatsMessage3;
            message1 = message1.replace("%nickname%", result.nickname);
            message1 = message1.replace("%country%", result.country);
            message1 = message1.replace("%membership%", result.membership_type);
            message2 = message2.replace("%region%", result.games.csgo.region);
            message2 = message2.replace("%level%", result.games.csgo.skill_level);
            message2 = message2.replace("%elo%", result.games.csgo.faceit_elo);
            message3 = message3.replace("%url%", result.faceit_url);
            message3 = message3.replace("{lang}","en");
            
            client.chat("\n        " + message1 + "\n\n        "+ message2 + "\n\n        " + message3);
            return;
        });

    }
    
    
    function setUser(client, name){

        let uid = client.uid();
        let hasSetUser = uid + "hasSetUser";
        let userValue = uid + "userValue";  
        let url = "https://open.faceit.com/data/v4/players?nickname=" + name + "&game=csgo";
        let hasEnabledTracking = uid + "hasEnabledTracking";
        let latestRank = uid + "latestRank";
        
        http.simpleRequest({
            'method': 'GET',
            'url': url,
            'timeout': 6000,
            'headers': {
                'Authorization': 'bearer ' + config.apiKey,
                }
            }, function (error, response) {
                if (error) {
                    engine.log("Error: " + error);
                    return;
                }
            
                if (response.statusCode != 200) {
                    engine.log("HTTP Error: " + response.status);
                    switch(response.statusCode){
                    
                        case 404:
                            let userNotExisting = config.userNotExisting;
                            userNotExisting = userNotExisting.replace("%fname%",name)
                            client.chat("\n     " + userNotExisting);
                            break;
                        case 401:
                            client.chat("\n     " + config.apiKey + " apikey not working.");
                            break;
                        case 503:
                            client.chat("\n     " + "FaceIT is currently DOWN.");
                            break;
                    
                }
                return;
                
            }
            
            var result = JSON.parse(response.data);
            
            engine.log("[FACEIT CSGO SCRIPT] Succesfull response for player " +       result.nickname );
            
            let successfullySyncMessage = config.successfullySyncMessage;
            successfullySyncMessage = successfullySyncMessage.replace("%fname%",name);
            
            store.set(hasSetUser, true);
            store.set(userValue, name);
            store.set(hasEnabledTracking,false);
            client.removeFromServerGroup(store.get(latestRank));
            store.unset(latestRank);
            
            client.chat("\n     " + successfullySyncMessage);
            client.chat("\n     " + config.afterSyncMessage);
            return;
        });
           
    }
    
    
    function unsetUser(client, name){
        
        let uid = client.uid();
        let hasSetUser = uid + "hasSetUser";
        let userValue = uid + "userValue";  
        let url = "https://open.faceit.com/data/v4/players?nickname=" + name + "&game=csgo";
        let hasEnabledTracking = uid + "hasEnabledTracking";
        let latestRank = uid + "latestRank";
            
        if(hasSetUser){
            
            let unsyncMessage = config.unsyncMessage;
            unsyncMessage = unsyncMessage.replace("%fname%",store.get(userValue));
            store.unset(hasSetUser);
            store.unset(userValue);
            store.unset(hasEnabledTracking);
            client.removeFromServerGroup(store.get(latestRank));
            store.unset(latestRank);
            client.chat("\n     " + unsyncMessage);
        }else         
            client.chat("\n     " + config.userNotSet);
     
        return;
    }
    
    
});