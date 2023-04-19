// https://leetcode.com/problems/max-points-on-a-line/solutions/3018636/integer-o-n-3-in-c-rust-go/
class Solution {
public:
    int maxPoints(vector<vector<int>>& points) {
        const size_t n = points.size();
        if (n < 3) {
            return static_cast<int>(n);
        }

        int maxPointsOnLine = 2;
        for (size_t i = 0; i < n - 2; ++i) {
            for (size_t j = i + 1; j < n - 1; ++j) {
                const int x1 = points[i][0], y1 = points[i][1],
                          x2 = points[j][0], y2 = points[j][1];
                int pointsOnLine = 2;
                for (size_t k = j + 1; k < n; ++k) {
                    const int x = points[k][0], y = points[k][1];
                    if ((y2 - y1) * (x - x1) == (x2 - x1) * (y - y1)) {
                        ++pointsOnLine;
                    }
                }
                maxPointsOnLine = std::max(maxPointsOnLine, pointsOnLine);
            }
        }
        return maxPointsOnLine; 
    }
};