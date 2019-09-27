function post(){
    function comment(id, mark, date, content, tags) {
        this.id = id;
        this.mark = mark;
        this.date = date;
        this.content = content;
        this.tags = tags;
      }

    var mark = $("#mark").attr("value");
    var content = $("#content").val();
    var date = new Date();
    var comments = [];
    if (content.length < 1) {
        alert("You have to enter at least 1 character")
    } else {
        if (localStorage.id === undefined) {
            localStorage.id = 1;
            // console.log("bolo null");
            var id = parseInt(localStorage.id); //id = 1 ciselne

            var comment = new comment(id, mark, date, content, null);
            comments.push(comment); //do pola pridam aktualny comment
            localStorage.setItem("comments", JSON.stringify(comments));

            //increment id
            localStorage.id = id + 1;
        } else {

            var id = parseInt(localStorage.id); //do id priradi cislo z localstorage.id
            var comments = JSON.parse(localStorage.getItem("comments"));
            var comment = new comment(id, mark, date, content, null);
            comments.push(comment);
            localStorage.setItem("comments", JSON.stringify(comments));

            //increment id
            localStorage.id = id + 1;
        }
    }

    setTimeout(
        load(), 2000);

    $("#content").val('');
    $(".active").removeClass("active");
    $("#mark").attr("value", "");
    $("#forma").addClass("disabled");
    $("#cancelforma").addClass("disabled");
  } //end of post



  function load() {

    var comments = JSON.parse(localStorage.getItem("comments"));
    if (comments === null) {
        console.log("there are no comments");

    } else {
        var count = comments.length;
        var i = 0;
        document.getElementById('komenty').innerHTML = "";
        while (i < count) {
        var ddd = comments[i].date;
        // console.log(ddd);
        // var komdate = ddd.substring(0,10);
        ddd = new Date(ddd);
        var month = ddd.getMonth() + 1;
        var day = ddd.getDate();
        var DateOutput = (day < 10 ? '0' : '') + day + "-" + (month < 10 ? '0' : '') + month + "-" + ddd.getFullYear();
        
            $("#komenty").prepend("<div id='"+ comments[i].id + "' class='removebtn " + comments[i].id + "'><span><strong>Remove</strong></span></div><div id='"+ comments[i].id + "' class='editbtn " + comments[i].id + "'><span><strong>Edit</strong></span></div><div id='" + comments[i].id + "' class='comment " + comments[i].id + " "+ comments[i].mark +"'><span class='comment-date'>" + DateOutput + "</span><div id='commenttags'></div><span class='comment-content'>" + comments[i].content + "</span></div>");
            //<div class='commenttag'>Custom Tag</div>
            
            i++;
        }

        //swipe events for comments
        $(".comment").on("swiperight", function () {
            if ($(this).hasClass("todelete")) {
                //when it is already swiped right
                console.log("uz je vpravo");
            } else if ($(this).hasClass("toedit")) {
                $(this).removeClass("toedit");
                var id = $(this).attr("id");
                $("." + id).removeClass("show");
                $(this).removeClass("editing");
                $("#content").val("");
                $(".active").removeClass("active");
                $("#updateforma").addClass("disabled");
                $("#cancelforma").addClass("disabled");
                $("#tagsforma").addClass("disabled");
                $("#mark").attr("value", "");
            } else {
                $(this).addClass("todelete");
                var id = $(this).attr("id");
                $(".removebtn." + id).addClass("show");
            }
        });

        $(".comment").on("swipeleft", function () {
            // $(".toedit").removeClass("toedit");
            // $(".show").removeClass("show");

            if ($(this).hasClass("toedit")) {
                //when it is already swiped left
                console.log("uz je vlavo");
            } else if ($(this).hasClass("todelete")) {
                $(this).removeClass("todelete");
                var id = $(this).attr("id");
                $("." + id).removeClass("show"); //schovaj delete button

            } else {
                $(this).addClass("toedit");
                var id = $(this).attr("id");
                // console.log(id);
                $(".editbtn." + id).addClass("show");
            }
        });
    }

    $(".editbtn").click(function () {
        $(".editing").removeClass("editing");
        var comments = JSON.parse(localStorage.getItem("comments")); //do comments  priradi komenty z localstorage, vytvori pole
        var id = $(this).attr("id");
        var index = 0;
        for(i=0; i<comments.length; i++){
            if(comments[i].id == id){
                var comment = comments[i]; //najdi kde v poli sa nachadza prislusny comment
            }
        }
    
        var mark = comment.mark; // aka je znacka commentu
        var content = comment.content; // obsah commentu

        $("#content").val(content);
        $(".active").removeClass("active");
        $("#" + mark).addClass("active");
        $("#mark").attr("value", mark);
        $("#forma").addClass("disabled");
        $("#updateforma").removeClass("disabled");
        $("#cancelforma").removeClass("disabled");
        $("#tagsforma").removeClass("disabled");
        var i = comments.length - 1;
        // console.log(id);
        while (i > 0) {
            if (i != id) {
                $("#" + i).removeClass("toedit");
                // console.log("nastava zmena ked i="+i)
            }
            // console.log(comments[i]);
            i--;
        }
        
        $("#" + id + ".comment").addClass("editing");
        window.scrollTo(0, 0);

    }); // end of click on editbtn

    $(".removebtn").click(function () {
        var comments = JSON.parse(localStorage.getItem("comments")); //do comments  priradi komenty z localstorage, vytvori pole
        var id = $(this).attr("id");

        for(i=0; i<comments.length; i++){
            if(comments[i].id == id){
                var index = i; //najdi kde v poli sa nachadza prislusny comment
            }
        }

        comments.splice(index, 1);
        console.log(comments)
        localStorage.setItem("comments", JSON.stringify(comments));

        $("#" + id).css("opacity", "0");
        setTimeout(function () {
            $("." + id).hide();
        }, 500);

        setTimeout(function () {
            load();
        }, 800);

    });


} //end of load()



function update() {
    var id = $(".editing").attr("id");
    var comments = JSON.parse(localStorage.getItem("comments"));
    var mark = $("#mark").attr("value");
    var content = $("#content").val();

    for(i=0; i<comments.length; i++){
        if(comments[i].id == id){
            var comment = comments[i]; //najdi kde v poli sa nachadza prislusny comment
            var index = i;
        }
    }

    // set new values for the comment
    comment.mark = mark;
    comment.content = content; 
    
    comments.splice(index, 1, comment);
    localStorage.setItem("comments", JSON.stringify(comments));

    setTimeout(function () {
        load();
        $("#updateforma").addClass("disabled");
        $("#cancelforma").addClass("disabled");
        $("#tagsforma").addClass("disabled");
        $("#forma").addClass("disabled");
        localStorage.removeItem("currenttags");
        $("#content").val("");
        $(".active").removeClass("active");
        $("#mark").attr("value", "");
    }, 300);

} //end of update()


function cancel() {
    $("#content").val("");
    $(".active").removeClass("active");
    $(".show").removeClass("show");
    $("#mark").attr("value", "");
    $(".toedit").removeClass("toedit");
    $(".editing").removeClass("editing");
    $("#updateforma").addClass("disabled");
    $("#cancelforma").addClass("disabled");
    $("#tagsforma").addClass("disabled");
    $("#forma").addClass("disabled");

} //end of cancel

function filterP() {
    $(".n").fadeOut(600);
    $(".f").fadeOut(600);
    $(".p").fadeIn(900);
}

function filterN() {
    $(".p").fadeOut(600);
    $(".f").fadeOut(600);
    $(".n").fadeIn(900);
}

function filterF() {
    $(".p").fadeOut(600);
    $(".n").fadeOut(600);
    $(".f").fadeIn(900);
}

function filterOff() {
    $(".p").fadeIn(600);
    $(".n").fadeIn(600);
    $(".f").fadeIn(900);
}


$(document).ready(function () {

    load();

    $(".selection").click(function () {
        var content = $("#content").val();
        $(".active").removeClass("active");
        $(this).addClass("active");
        // console.log($(this).attr('id'));
        $("#mark").attr("value", $(this).attr("id"));
        if ($(".editing")[0]) {
            $("#cancelforma").removeClass("disabled");
        } else {
            $("#forma").removeClass("disabled");
            $("#cancelforma").removeClass("disabled");
        }
    });

    
})