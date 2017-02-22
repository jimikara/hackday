// function to rate quiz.  Takes args correct and total

function rateQuiz(correct, total) {
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
