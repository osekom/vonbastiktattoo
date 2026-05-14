/* Tattoo Artist Manager - Admin Scripts */
/*global jQuery, wp, tamAdmin*/

(function($) {
    'use strict';

    // ========================================
    // Hero Cover Image Uploader
    // ========================================
    var heroUploader = null;

    $(document).on('click', '#tam-upload-hero-btn', function(e) {
        e.preventDefault();

        if (heroUploader) {
            heroUploader.open();
            return;
        }

        heroUploader = wp.media({
            title: 'Select Hero Cover Image',
            button: {
                text: 'Use as Hero Cover'
            },
            multiple: false,
            library: {
                type: 'image'
            }
        });

        heroUploader.on('select', function() {
            var attachment = heroUploader.state().get('selection').first().toJSON();
            var imageUrl = attachment.sizes ? attachment.sizes.full.url : attachment.url;
            var imageId = attachment.id;

            $('#tam-hero-cover-preview').html('<img src="' + imageUrl + '" alt="Hero Cover Preview" style="max-width: 100%; height: auto; max-height: 300px;" />');
            $('#_tam_hero_cover_id').val(imageId);
            $('#tam-remove-hero-btn').show();
        });

        heroUploader.open();
    });

    $(document).on('click', '#tam-remove-hero-btn', function(e) {
        e.preventDefault();
        $('#tam-hero-cover-preview').html('<p><em>No hero cover image selected.</em></p>');
        $('#_tam_hero_cover_id').val('');
        $(this).hide();
    });

    // ========================================
    // Gallery Images Uploader
    // ========================================
    var galleryUploader = null;

    $(document).on('click', '#tam-upload-gallery-btn', function(e) {
        e.preventDefault();

        if (galleryUploader) {
            galleryUploader.open();
            return;
        }

        galleryUploader = wp.media({
            title: 'Add Gallery Images',
            button: {
                text: 'Add to Gallery'
            },
            multiple: true,
            library: {
                type: 'image'
            }
        });

        galleryUploader.on('select', function() {
            var selection = galleryUploader.state().get('selection');
            var attachments = selection.toArray();
            var currentIds = $('#_tam_gallery_ids').val().split(',').filter(function(id) { return id !== ''; });
            var preview = $('#tam-gallery-preview');

            _.each(attachments, function(attachment) {
                var attachmentData = attachment.toJSON();
                var imageUrl = attachmentData.sizes ? attachmentData.sizes.thumbnail.url : attachmentData.url;
                var imageId = attachmentData.id;

                // Add to hidden input
                currentIds.push(imageId.toString());

                // Add thumbnail preview
                var itemHtml = '<div class="tam-gallery-item" style="position: relative; width: 120px; height: 120px; border: 1px solid #ccc;">';
                itemHtml += '<img src="' + imageUrl + '" alt="" style="width: 100%; height: 100%; object-fit: cover;" />';
                itemHtml += '<button type="button" class="tam-remove-gallery-item" data-id="' + imageId + '" style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer; width: 24px; height: 24px; line-height: 20px; text-align: center; font-weight: bold;">&times;</button>';
                itemHtml += '</div>';
                
                preview.append(itemHtml);
            });

            $('#_tam_gallery_ids').val(currentIds.join(','));
        });

        galleryUploader.open();
    });

    // Remove individual gallery item
    $(document).on('click', '.tam-remove-gallery-item', function(e) {
        e.preventDefault();
        var imageId = $(this).data('id');
        
        $(this).parent().remove();
        
        var currentIds = $('#_tam_gallery_ids').val().split(',').filter(function(id) { return id !== ''; });
        var index = currentIds.indexOf(imageId.toString());
        if (index > -1) {
            currentIds.splice(index, 1);
        }
        $('#_tam_gallery_ids').val(currentIds.join(','));
    });

})(jQuery);
