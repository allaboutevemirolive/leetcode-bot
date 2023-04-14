// https://leetcode.com/problems/max-points-on-a-line/solutions/3020593/rust-solution-with-gcd-hashmap/
use std::collections::HashMap;
pub fn gcd(mut a : i32, mut b : i32) -> i32
{
    if (a == 0) {
        return b;
    }
    gcd(b % a, a)
}
impl Solution {
    pub fn max_points(mut points: Vec<Vec<i32>>) -> i32 {
        let n = points.len();
        if n <= 2 {
            return n as i32;
        }
        let mut lines : HashMap<Vec<i32>, i32> = HashMap::new();
        let mut res = 2;
        let mut flag = true;
        for i in 1..n {
            for j in 0..i {
                let mut line = vec![(points[i][1] - points[j][1]),
                                (points[j][1] * points[i][0] - points[i][1] * points[j][0]),
                                (points[i][0] - points[j][0])];
                let g = gcd(gcd(line[0], line[1]), line[2]);
                line = line.iter().map(|x| x / g).collect();
                lines.entry(line).and_modify(|counter| {*counter += 1; if res < *counter {res = *counter};}).or_insert(1);
            }
        }
        let mut ans = 2;
        while (ans * (ans + 1) <= res * 2) {ans += 1;}
        ans
    }
}