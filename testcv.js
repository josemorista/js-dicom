const cv = require('opencv4nodejs')
const mat = cv.imread('./path/test.jpg')
cv.imshow('a window name', mat)
cv.waitKey()
