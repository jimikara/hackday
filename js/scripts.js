/* SCREENS
--------------------------------------- */

var Quiz = {

    init: function(){
        this.cacheDom();
        this.settings();
        this.bindEvents();
    },

    settings: function(){
        this.api = 'http://34.194.223.110/api';
    },

    cacheDom: function(){
        this.$el        = $('#play');
        this.template   = this.$el.find('#quiz-template').html();
        this.$wrap      = this.$el.find('.quiz-wrap');

        this.$header    = $('.header');
        this.$logo      = this.$header.find('.header_logo');
        this.$countdown = this.$header.find('.countdown');

        this.$loadNewQ = this.$el.find('.quiz-loadNewQ'); // temp
        this.interval;
    },

    bindEvents: function(){

        // Catch the show-screen event
        this.$el.on('show', this.start.bind(this));

        // Catch Answer
        this.$el.on('click', 'figure', this.selectAnswer.bind(this));

        // Load new question
        this.$loadNewQ.on('click', this.loadNewQuestion.bind(this));
    },

    start: function(){

        var that = this;

        this.turns   = 0;
        this.correct = 0;
        this.questionNumber = false;
        this.answers = [];

        this.startCountdown(60 * 1, this.$countdown);
        this.render();
    },

    startCountdown(duration, display) {

        this.$header.addClass('running');

        var timer = duration, minutes, seconds;

        this.interval = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.text(minutes + ":" + seconds);

            if (--timer < 0) {
                this.finish();
            }
        }.bind(this), 1000);

    },

    render: function() {
        this.loadNewQuestion()
    },

    finish() {
        clearInterval(this.interval);
        this.$header.removeClass('running');
        results.render();
        screens.triggerScreen('done');
    },

    renderQuestion(data){
        data.splitDesc = this.splitText(data.text)
        data.score = this.turns;
        data.answers = this.answers.reverse();

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
            this.questionNumber = data.questionNumber;
            this.correctId = data.correctId;
            this.renderQuestion(data);
        }.bind(this));

        if (typeof e === "object") {
            e.preventDefault();
        }
    },

    selectAnswer: function(e){

        if (this.correctId === $(e.target).data('id')) {
            this.correct++;
            this.answers.push(1);
        } else {
            this.answers.push(0);
        }

        this.turns++;

        this.loadNewQuestion();

    },


    splitText(text){

        var speeds = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'];

        var r = $.map(text.split(' '), function(word){
            var speed  = Math.floor(Math.random() * speeds.length);
            return '<span class="' + speeds[speed] + '">' + word + '</span>';
        })

        return r.join("");
    }

}

/* RESULTS
--------------------------------------- */

var results = {

    init: function(){
        this.cacheDom();
        this.render();
    },

    cacheDom: function(){
        this.$el      = $('#results');
        this.wrap     = this.$el.find('.result-wrap');
        this.template = this.$el.find('#results-template').html();
    },

    render: function(){

        var data = {
            correct: Quiz.correct,
            turns: Quiz.turns,
            inWords: this.rateQuiz(Quiz.correct, Quiz.turns)
        }

        this.wrap.html(Mustache.render(this.template, data))
    },

    rateQuiz(correct, total) {
        // find ratio
        var ratio = Math.round((correct / total) * 10);
        if (ratio >= 8) {
            return "Impressive Stuff!";
        }
        else if (ratio >= 6 && ratio < 8) {
            return "Solid work";
        }
        else if (ratio >= 4 && ratio < 6) {
            return "Not too bad..";
        }
        else if (ratio >= 1 && ratio < 4) {
            return "Better luck next time";
        }
        else {
            return "What happened?!";
        }
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
        
        FB.XFBML.parse();

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
    results.init();
})
