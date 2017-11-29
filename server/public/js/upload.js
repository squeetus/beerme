$(document).ready(function() {
  $('#addimg').on('click', function (){
      $('#upload-input').click();
      $('.progress-bar').text('0%');
      $('.progress-bar').width('0%');
  });

  $("#upload-input").on('change', function() {
    if(this.files.length == 1) {
      console.log('ok');
      $('#addimg').html('OK!');
    }
    else {
      alert("OOP, couldn't find the image. Try again!");
    }
  });

  $('#upload').on('click', function(){

    var files = $('#upload-input').get(0).files;

    if (files.length !== 1){
      alert("Grab an image, fool");
    } else {
      // create a FormData object which will be sent as the data payload in the
      // AJAX request
      var formData = new FormData();
      var keepGoing = true;

      // (validate and) add other attributes to the form
      var review = {};
      $('input.form-control').each(function() {
          if($(this).val() === "") {
            alert("AHHHHH " + $(this).attr('name') + " needs a value pls sir");
            keepGoing = false;
            return false;
          }
          review[$(this).attr('name')] = $(this).val();
      });
      review.description = $('#description').val();

      if(!keepGoing) return false;

      formData.append('review', JSON.stringify(review));

      // loop through all the selected files and add them to the formData object
      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // add the files to formData object for the data payload
        formData.append('uploads[]', file, review.brewery + "_" + review.beer);
      }

      $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
        },
        xhr: function() {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();

          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) {

            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);

              // update the Bootstrap progress bar with the new percentage
              $('.progress-bar').text(percentComplete + '%');
              $('.progress-bar').width(percentComplete + '%');

              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                $('.progress-bar').html('Done');
                $('input.form-control').each(function() {
                    // $(this).val("");
                });
              }

            }

          }, false);

          return xhr;
        }
      });

    }
  });
});
