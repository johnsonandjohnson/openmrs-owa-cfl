$(function() {
    /** Home **/
    const breadcrumbs = $("#breadcrumbs");
    if (breadcrumbs.is(':empty')) {
        $("#breadcrumbs").append("<span><a href=\"/openmrs/\">Home</a><span class=\"separator\">&gt;&gt;</span></span>");
    }
    /** Patient Dashboard **/
    const firstInfoContainer = $(".info-container:first-of-type");
    if (!firstInfoContainer.is(':empty')) {
        const remainingContainersChildren = $(".info-container:not(:first-of-type) > [privilege] > *, .info-container:not(:first-of-type) > *");
        remainingContainersChildren.detach().appendTo(firstInfoContainer);
    }
    const patientHeader = $(".patient-header");
    if (!patientHeader.is(':empty')) {
        const givenName = $(".PersonName-givenName").text();
        const middleName = $(".PersonName-middleName").text();
        const familyName = $(".PersonName-familyName").text();
    }
});
