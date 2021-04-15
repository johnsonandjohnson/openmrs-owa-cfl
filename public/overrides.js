$(function() {
    const breadcrumbs = $("#breadcrumbs");
    if (breadcrumbs.is(':empty')) {
        $("#breadcrumbs").append("<span><a href=\"/openmrs/\">Home</a><span class=\"separator\">&gt;&gt;</span></span>");
    }
});
