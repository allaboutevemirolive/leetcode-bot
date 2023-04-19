// https://leetcode.com/problems/expression-add-operators/solutions/850615/rust-translated-4ms-100/
struct Solution;

impl Solution {
    pub fn add_operators(a: String, target: i32) -> Vec<String> {
        fn helper(
            ans: &mut Vec<String>,
            path: &mut [u8],
            mut path_index: i32,
            chars: &[u8],
            char_index: i32,
            left: i64,
            cur: i64,
            target: i32,
        ) {
            if char_index == chars.len() as i32 {
                if left + cur == target as i64 {
                    ans.push(
                        std::str::from_utf8(&path[0..path_index as usize])
                            .unwrap()
                            .to_owned(),
                    );
                }
                return;
            }
            let mut n = 0i64;
            let sign_index = path_index;
            path_index += 1;
            for i in char_index..chars.len() as i32 {
                path[path_index as usize] = chars[i as usize];
                path_index += 1;
                n = n * 10 + (chars[i as usize] - b'0') as i64; //add a new digit
                path[sign_index as usize] = b'+';
                helper(ans, path, path_index, chars, i + 1, left + cur, n, target);
                path[sign_index as usize] = b'-';
                helper(ans, path, path_index, chars, i + 1, left + cur, -n, target);
                path[sign_index as usize] = b'*';
                helper(ans, path, path_index, chars, i + 1, left, cur * n, target);
                if n == 0 {
                    break;
                }
            }
        }
        let n = a.len();
        let v = a.as_bytes();
        let mut path = vec![0; n + n];
        let mut ans = vec![];
        let mut x = 0i64;
        for i in 0..n {
            x = x * 10 + (v[i] - b'0') as i64;
            path[i] = v[i];
            helper(
                &mut ans,
                &mut path,
                (i + 1) as i32,
                v,
                (i + 1) as i32,
                0,
                x,
                target,
            );
            if x == 0 {break;}
        }
        ans
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_operators() {
        assert_eq!(
            Solution::add_operators("123".to_string(), 6),
            vec!["1+2+3".to_string(), "1*2*3".to_string()]
        );
    }

    #[test]
    fn test_add_operators_02() {
        assert_eq!(
            Solution::add_operators("232".to_string(), 8),
            vec!["2*3+2".to_string(), "2+3*2".to_string()]
        );
    }

    #[test]
    fn test_add_operators_03() {
        assert_eq!(
            Solution::add_operators("105".to_string(), 5),
            vec!["1*0+5".to_string(), "10-5".to_string()]
        );
    }

    #[test]
    fn test_add_operators_04() {
        assert_eq!(
            Solution::add_operators("00".to_string(), 0),
            vec!["0+0".to_string(), "0-0".to_string(), "0*0".to_string()]
        );
    }

    #[test]
    fn test_add_operators_05() {
        assert_eq!(
            Solution::add_operators("000".to_string(), 0),
            vec![
                "0*0*0".to_string(),
                "0*0+0".to_string(),
                "0*0-0".to_string(),
                "0+0*0".to_string(),
                "0+0+0".to_string(),
                "0+0-0".to_string(),
                "0-0*0".to_string(),
                "0-0+0".to_string(),
                "0-0-0".to_string()
            ]
        );
    }
}