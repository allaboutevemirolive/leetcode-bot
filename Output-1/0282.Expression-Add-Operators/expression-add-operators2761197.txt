// https://leetcode.com/problems/expression-add-operators/solutions/2761197/rust-concise-back-tracking/
impl Solution {
    pub fn add_operators(num: String, target: i32) -> Vec<String> {
        let n = num.len();
        let num = num.chars().collect::<Vec<char>>();
        let mut ret = vec![];
        
        Self::back_tracking(&num, 0, (0, 0), target as i64, String::new(), &mut ret);
        
        ret 
    }
    
    fn back_tracking(num: &Vec<char>, i: usize, a: (i64, i64), target: i64, str: String, ret: &mut Vec<String>) {
        if i == num.len() {
            if a.0 + a.1 == target { ret.push(str); }
            return
        }
        
        let n = num.len();
        let mut temp = 0;
        let mut op = String::new();
        
        for k in i .. n {
            op.push(num[k]);
            temp = 10 * temp + (num[k] as u8 - '0' as u8) as i64;
            //if k < n - 1 && num[k + 1] == '0' { continue }
            
            if i == 0 {
                Self::back_tracking(num, k + 1, (0, temp), target, op.clone(), ret);
                if num[i] == '0' { break }
                continue
            }
            
            let mut s1 = str.clone();
            s1.push('+');
            s1 += &op;
            Self::back_tracking(num, k + 1, (a.0 + a.1, temp), target, s1, ret);
            
            let mut s2 = str.clone();
            s2.push('-');
            s2 += &op;
            Self::back_tracking(num, k + 1, (a.0 + a.1, -temp), target, s2, ret);
            
            let mut s3 = str.clone();
            s3.push('*');
            s3 += &op;
            Self::back_tracking(num, k + 1, (a.0, a.1 * temp), target, s3, ret);
            if num[i] == '0' { break }
        }
    }
}