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
        this.$el        = $('#play');
        this.template   = this.$el.find('#quiz-template').html();
        this.$wrap      = this.$el.find('.quiz-wrap');
        this.$countdown = $('.countdown');

        this.$loadNewQ = this.$el.find('.quiz-loadNewQ');
    },

    bindEvents: function(){

        // Catch the show-screen event
        this.$el.on('show', this.start.bind(this));

        // Load new question
        this.$loadNewQ.on('click', this.loadNewQuestion.bind(this));
    },

    start: function(){

        var that = this;

        this.turns   = 0;
        this.correct = 0;

        this.startCountdown(5 * 1, this.$countdown);
        this.render();
    },

    startCountdown(duration, display) {

        var timer = duration, minutes, seconds;

        var interVal = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            milli   = parseInt(timer % 60 % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.text(minutes + ":" + seconds);

            if (--timer < 0) {
                clearInterval(interVal);
                screens.triggerScreen('done');
            }
        }.bind(this), 1000);

    },

    render: function() {
        this.loadNewQuestion()
    },

    renderQuestion(data){
        this.$wrap.html(
            Mustache.render(this.template, data)
        );

    },

    loadNewQuestion(e){

        $.when(
            $.ajax({
                url: this.api + '/questions/',
            })
        ).done(function(data){
            this.renderQuestion(data);
        }.bind(this));

        if (typeof e === "object") {
            e.preventDefault();
        }
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
