/* SCREENS
--------------------------------------- */

var Quiz = {

    init: function(){
        this.cacheDom();
        this.settings();
        this.bindEvents();

        // this.getQuestion();
    },

    settings: function(){
        this.api = 'http://34.194.223.110/api';
    },

    cacheDom: function(){
        this.$el = $('#play');
    },

    bindEvents: function(){

        // Catch the show-screen event
        this.$el.on('show', this.start.bind(this));
    },

    start: function(){

        var that = this;

        this.answer  = "";
        this.turns   = 0;
        this.correct = 0;
        this.steak   = 0;

        this.render();
    },

    render: function() {
        console.log('now');
    },

    getQuestion: function(){

        $.when(
            $.ajax({
                url: this.api + '/questions/',
            })
        ).done(function(result){
            console.log(result);
        });
    }

}

/* SCREENS
--------------------------------------- */

var screens = {

    init: function(){
        this.cacheDom();
        this.bindEvents();
        this.checkHashOnLoad();
    },

    cacheDom: function(){
        this.$screens = $('.screen');
        this.$currentScreen = false;
    },

    bindEvents: function(){
        window.addEventListener("hashchange", this.showScreen.bind(this))
    },

    triggerScreen: function(name){

        if (window.location.hash == name) {
            this.showScreen(name);
        } else {
            window.location.hash = name;
        }

    },

    showScreen: function(name){

        // name is a string [ sceens.showScreen() ] [[string 'quiz']]
        // name is a hashchange event               [[object, HashChangeEvent{}]]
        // There's an additional trigger('show') to catch the show event

        name = (typeof name === "string") ? name : this.getHashFromUrl(name.newURL);

        // Remove "#" from the hash

        name = name.replace("#", "");

        this.$screens.hide();
        this.$currentScreen = this.$screens.filter('[data-screen="' + name + '"]').show().trigger('show');

    },

    getHashFromUrl: function(url){

        this.parser = document.createElement('a');
        this.parser.href = url;

        return this.parser.hash;
    },

    checkHashOnLoad: function(){
        this.triggerScreen('#intro');
    }

}

$(function(){
    Quiz.init();
    screens.init();
})
