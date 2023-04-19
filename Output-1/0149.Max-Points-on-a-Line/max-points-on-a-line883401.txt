// https://leetcode.com/problems/max-points-on-a-line/solutions/883401/rust-translated-4ms-100/
impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        use std::collections::HashMap;

        fn gcd(mut a: i32, mut b: i32) -> i32 {
            while b != 0 {
                let r = a % b;
                a = b;
                b = r;
            }
            a
        }
        let n = points.len();
        if n < 2 {
            return n as i32;
        }
        let mut ans = 0;
        for i in 0..n - 1 {
            let mut map = HashMap::<(i32, i32), i32>::new();
            let mut same_point = 0;
            let mut same_line = 1;
            for j in i + 1..n {
                if points[i] == points[j] {
                    same_point += 1;
                    continue;
                }
                let dx = points[i][0] - points[j][0];
                let dy = points[i][1] - points[j][1];
                let gcd = gcd(dx, dy);
                let comm_x = dx / gcd;
                let comm_y = dy / gcd;
                let val = match map.get_mut(&(comm_x, comm_y)) {
                    Some(x) => {
                        *x += 1;
                        *x
                    }
                    None => {
                        map.entry((comm_x, comm_y)).or_insert(2);
                        2
                    }
                };
                same_line = std::cmp::max(same_line, val);
            }
            ans = std::cmp::max(ans, same_line + same_point);
        }
        ans
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_max_points() {
        assert_eq!(
            Solution::max_points(vec![vec![1, 1], vec![2, 2], vec![3, 3]]),
            3
        );
    }

    #[test]
    fn test_max_points_02() {
        assert_eq!(
            Solution::max_points(vec![
                vec![1, 1],
                vec![3, 2],
                vec![5, 3],
                vec![4, 1],
                vec![2, 3],
                vec![1, 4]
            ]),
            4
        );
    }
}