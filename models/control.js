exports.ensureOnlyVendor = function(req, res, next) {
    if (req.isAuthenticated() && req.user.role == "vendor") {
        return next();
    }
    res.redirect("/login");
}

exports.ensureOnlyClient = function(req, res, next) {
    if (req.isAuthenticated() && req.user.role == "client") {
        return next();
    }
    res.redirect("/login");
}

exports.ensureOnlyDispatch = function(req, res, next) {
    if (req.isAuthenticated() && req.user.role == "dispatch") {
        return next();
    }
    res.redirect("/login");
}