

const indentifyUser = (res, req, next) => {
    const token = req.cookies

    const decodedToken = token.verify()
}

module.exports = indentifyUser