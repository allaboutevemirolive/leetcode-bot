// https://leetcode.com/problems/valid-number/solutions/733633/serious-elegant-rust-solution/
fn get_sign(s: &[u8], begin: usize) -> Option<usize> {
    let sign = *s.get(begin)?;
    Some(if sign == b'+' || s[begin] == b'-' { 1 } else { 0 })
}

fn get_uint(s: &[u8], begin: usize) -> Option<usize> {
    let mut i = begin;
    while i < s.len() && s[i] >= b'0' && s[i] <= b'9' {
        i += 1;
    }
    Some(i - begin).filter(|&x| x != 0)
}

fn get_float(s: &[u8], mut begin: usize) -> Option<usize> {
    begin += get_sign(s, begin).unwrap_or(0);
    let mut meaningful = true;
    begin += get_uint(s, begin).unwrap_or_else(|| { meaningful = false; 0 });
    if s.get(begin).copied() == Some(b'.') {
        begin += 1;
        begin += get_uint(s, begin).map(|x| { meaningful = true; x }).unwrap_or(0);
    }
    Some(begin).filter(|_| meaningful)
}

fn get_number(s: &[u8], mut begin: usize) -> Option<usize> {
    begin += get_float(s, begin)?;
    if s.get(begin).copied() == Some(b'e') {
        begin += 1;
        begin += get_sign(s, begin).unwrap_or(0);
        begin += get_uint(s, begin)?;
    }
    Some(begin)
}

pub fn is_number(s: String) -> bool {
    let s = s.trim().to_string().into_bytes();
    get_number(&s, 0) == Some(s.len())
}
