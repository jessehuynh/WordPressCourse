import $ from 'jquery';

class MyNotes {
    constructor(){
        this.events();
    }
    events() {
        $('#my-notes').on('click', '.delete-note', this.deleteNote);
        $('#my-notes').on('click', '.edit-note', this.editNote.bind(this));
        $('#my-notes').on('click', '.update-note', this.updateNote.bind(this));
        $('.submit-note').on('click', this.createNote.bind(this));
    }
    deleteNote(e) {
        let thisNote = $(e.target).parents('li')
        $.ajax({
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-WP-NONCE', universityData.nonce)      
            },
            url: `${universityData.root_url}/wp-json/wp/v2/note/${thisNote.data('id')}`,
            type:'DELETE',
            success: (response) => {
                thisNote.slideUp();
                if(response.userNoteCount < 5){
                    $('.note-limit-message').removeClass('active')
                }
            },
            error: (response) => {
                console.log('ruh roh, error')
                console.log(response)
            }
        });
    }
    editNote(e){
        let thisNote = $(e.target).parents('li');
        if(thisNote.data('state') == 'editable') {
            this.readonlyNote(thisNote)
        } else {
            this.editableNote(thisNote)
        }
    }
    editableNote(thisNote) {
        thisNote.find('.edit-note').html(`
            <i class="fa fa-times" aria-hidden="true"></i> Cancel
        `)
        thisNote
            .find('.note-title-field, .note-body-field')
            .removeAttr('readonly')
            .addClass('note-active-field');
        thisNote.find('.update-note').addClass('update-note--visible')
        thisNote.data('state', 'editable');

    }
    readonlyNote(thisNote) {
        thisNote.find('.edit-note').html(`
        <i class="fa fa-pencil" aria-hidden="true"></i> Edit
        `)
        thisNote
            .find('.note-title-field, .note-body-field')
            .attr('readonly', 'readonly')
            .removeClass('note-active-field');
        thisNote.find('.update-note').removeClass('update-note--visible')  
        thisNote.data('state', 'cancel')
    }
    updateNote(e) {
        let thisNote = $(e.target).parents('li')
        let updatedPost = {
            'title': thisNote.find('.note-title-field').val(),
            'content': thisNote.find('.note-body-field').val(),
        }
        $.ajax({
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-WP-NONCE', universityData.nonce)      
            },
            url: `${universityData.root_url}/wp-json/wp/v2/note/${thisNote.data('id')}`,
            type:'POST',
            data: updatedPost,
            success: () => {
                this.readonlyNote(thisNote)
            },
            error: (response) => {
                console.log('ruh roh, error')
                console.log(response)
            }
        });
    }
    createNote() {
        let newPost = {
            'title': $('.new-note-title').val(),
            'content': $('.new-note-body').val(),
            'status': 'publish',
        }
        $.ajax({
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-WP-NONCE', universityData.nonce)      
            },
            url: `${universityData.root_url}/wp-json/wp/v2/note/`,
            type:'POST',
            data: newPost,
            success: (response) => {
                $('.new-note-body, .new-note-title').val(' ');
                $(`
                    <li data-id="${response.id}">
                        <input readonly type="text" value="${response.title.rendered}" class="note-title-field">
                        <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
                        <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
                        <textarea readonly name="" id="" cols="30" rows="10" class="note-body-field">${response.content.raw}</textarea>
                        <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
                    </li>
                `).prependTo('#my-notes').hide().slideDown();
                console.log(response)
            },
            error: (response) => {
                console.log('ruh roh, error')
                console.log(response)
                if(response.responseText == "You have reached your note limit"){
                    $('.note-limit-message').addClass('active')
                }
            }
        });
    }
}

export default MyNotes;