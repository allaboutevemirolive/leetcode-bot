// https://leetcode.com/problems/permutation-sequence/solutions/763508/rust-0-ms/
impl Solution {
    pub fn get_permutation(n: i32, k: i32) -> String {
        
            let mut n: usize = n as usize;
    let mut k = k as usize;
    let mut factorial: Vec<i32> = vec![0;n];
    let mut candidate: Vec<i32> = Vec::new();
    for i in 0..n {
        candidate.push(i as i32 + 1);
        factorial[i] = if i == 0 {
            1
        } else {
            i as i32 * factorial[i-1]
        }
    }
    let mut st = String::new();
    while n > 0 {
        let remain = ((k-1) % factorial[n-1] as usize) + 1;
        st.push_str(&candidate.remove((k-1)/ factorial[n-1] as usize).to_string());
        n-=1;
        k = remain;
    }
    st
    }
}