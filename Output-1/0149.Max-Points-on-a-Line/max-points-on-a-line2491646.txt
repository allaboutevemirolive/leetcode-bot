// https://leetcode.com/problems/max-points-on-a-line/solutions/2491646/rust-n-3-collinearity-test/
impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        let points: Vec<_> = points.into_iter().map(|v| (v[0], v[1])).collect();

        let n = points.len();
        let mut max_count = 1;
        for i in 0..n {
            for j in i + 1..n {
                let mut count = 2;
                for k in j + 1..n {
                    if Self::colinear(points[i], points[j], points[k]) {
                        count += 1;
                    }
                }

                if count > max_count {
                    max_count = count;
                }
            }
        }

        max_count
    }

    pub fn colinear(a: (i32, i32), b: (i32, i32), c: (i32, i32)) -> bool {
        let (x1, y1) = a;
        let (x2, y2) = b;
        let (x3, y3) = c;
        /*
         * | x1 y1 1 |
         * | x2 y2 1 | = 0
         * | x3 y3 1 |
         *
         *  x1 (y2 - y3) + -y1 * (x2 - x3) + (x2 * y3 - y2 *x3) == 0
         * */

        (x1 * (y2 - y3)) + (-y1 * (x2 - x3)) + (x2 * y3 - y2 * x3) == 0
    }
}

#[test]
fn colinear() {
    assert_eq!(Solution::max_points(vec![vec![1, 1], vec![2, 2], vec![3, 3]]), 3);
}