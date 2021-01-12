exports.ensureOnlyVendor = function(req, res, next) {
    if (req.isAuthenticated() && req.user.role == "vendor") {
        return next();
    }
    res.redirect("/login");
}