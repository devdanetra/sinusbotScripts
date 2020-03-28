registerPlugin({
    name: 'Genders',
    version: '1.1',
    description: 'Assignes users genders',
    author: 'devdanetra <devdanetra@outlook.com>',
    vars: [
	{
        name: "joinQuestion",
        type: "string",
        title: "Your custom join question .",
        placeholder: "[b]Since it's the first time , select your gender: [/b]",
        default: "[b]Since it's the first time , select your gender: [/b]",
    },
	{
        name: "maleMessage",
        type: "string",
        title: "Male option.",
        placeholder: "Type 'M' for male (♂)",
        default: "Type 'M' for male (♂)",
    },
    {
        name: "maleLetter",
        type: "string",
        title: "Female option.",
        placeholder: "M",
        default: "M",
    },
	{
        name: "femaleMessage",
        type: "string",
        title: "Female option.",
        placeholder: "Type 'F' for female (♀)",
        default: "Type 'F' for female (♀)",
    },
    {
        name: "femaleLetter",
        type: "string",
        title: "Female option.",
        placeholder: "F",
        default: "F",
    },
	{
        name: "otherMessage",
        type: "string",
        title: "Other option.",
        placeholder: "Type 'O' for other",
        default: "Type 'O' for other"
    },
    {
        name: "otherLetter",
        type: "string",
        title: "Other option.",
        placeholder: "O",
        default: "O",
    },
	{
        name: "setMessage",
        type: "string",
        title: "Set Message.",
        placeholder: "You got your gender!",
        default: "You got your gender!",
    },
    {
        name: "maleGroupID",
        type: "number",
        title: "Set male Group ID.",
    },
    {
        name: "femaleGroupID",
        type: "number",
        title: "Set female Group ID.",
    },
    {
        name: "otherGroupID",
        type: "number",
        title: "Set other Group ID.",
    },
	],
}, function(sinusbot, config) {
	
	const engine = require('engine');
	const store = require('store');
	const backend = require('backend');
	

	var event = require('event');
    event.on('clientMove', function(ev) {		//chat event function
        
        var client = ev.client;
        var uid = client.uid();
        var hasGender = uid + "hasGender";
        
        if(!(store.get(hasGender)==true)){
            client.chat("\n     " + config.joinQuestion + "\n       " + config.maleMessage + "\n       " + config.femaleMessage + "\n       " + config.otherMessage);
        }
        
		return;
	});
    
    event.on('chat', function(ev) {		//chat event function
        
        var client = ev.client;
        var uid = client.uid();
        var hasGender = uid + "hasGender";

        if(store.get(hasGender)==true){
                    return;
        }else{
            switch(ev.text){
                
            case config.femaleLetter:
                client.addToServerGroup(config.femaleGroupID);
                store.set(hasGender,true);
                client.chat("\n     " + config.setMessage);
                break;
            case config.maleLetter:
                client.addToServerGroup(config.maleGroupID);
                store.set(hasGender,true);
                client.chat("\n     " + config.setMessage);
                break;
            case config.otherLetter:
                client.addToServerGroup(config.otherGroupID);
                store.set(hasGender,true);
                client.chat("\n     " + config.setMessage);
                break;
            default:
            }  
        }
		return;
	});
	
});