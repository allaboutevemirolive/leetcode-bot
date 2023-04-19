// https://leetcode.com/problems/expression-add-operators/solutions/354772/c-concise-dfs/
impl Solution {
    pub fn add_operators(num: String, target: i32) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();
        if num.len() != 0 {
            Solution::dfs(&num[..], &target, String::new(), &mut res, 0, 0, 0);
        }
        return res;
    }

    pub fn dfs(num: &str, target: &i32, path: String, res: &mut Vec<String>, prev: i64, cur: i64, start: usize) {
        if start == num.len() && prev + cur == (*target as i64) {
            res.push(path);
            return;
        }
        let mut i = start + 1;
        while i <= num.len() {
            let n: i64 = num[start..i].parse().unwrap();
            if start == 0 {
                Solution::dfs(num, target, String::from(&num[start..i]), res, 0, n, i);
            } else {
                Solution::dfs(num, target, path.clone() + "+" + &num[start..i], res, prev + cur, n, i);
                Solution::dfs(num, target, path.clone() + "-" + &num[start..i], res, prev + cur, -n, i);
                Solution::dfs(num, target, path.clone() + "*" + &num[start..i], res, prev, cur * n, i);
            }
            if num[start..i].starts_with("0") {
                i = num.len();
            }
            i = i + 1;
        }
    }
}