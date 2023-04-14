// https://leetcode.com/problems/super-palindromes/solutions/575968/rust-iterator-based-solution/
impl Solution {
    
    pub fn superpalindromes_in_range(l: String, r: String) -> i32 {

        let start = l.parse::<i64>().unwrap_or(1);
        
        let end = r.parse::<i64>().unwrap_or(i64::max_value());
        
        let map = (1..=100000).map(|i| i.to_string()); // 10^5 is upper limit of first half of palindrome given instructions that start length < 10^18 digits
        
        count_palindromes(map, true, start, end, 0)        
        
    }
    
}

fn is_palindrome(x: i64) -> bool {
    
    let mut n = x;
    
    let mut rev = 0;
    
    while n > 0 {
    
        rev = 10 * rev + n % 10;
        
        n /= 10;
    
    } 
    
    rev == x
}

fn count_palindromes(iter: impl Iterator<Item=String> + std::clone::Clone, even: bool, start: i64, end: i64, mut count: i32) -> i32 {
    
    let offset = { if even { 0 } else { 1 } }; // offset of 1 creates palindromes pivoting around last digit of item, offset of 0 creates palindrome pivoting around end of item
    
    let cln = iter.clone();
    
    count += cln.map(|s| s.chars().chain(s.chars().rev().skip(offset)).collect::<String>())
            .map(|s| s.parse::<i64>().unwrap())
            .map(|i| i*i)
            .take_while(|&sqr| sqr <= end)
            .filter(|&sqr| sqr >= start && is_palindrome(sqr))
            .count() as i32;
    
    if even {
    
        count_palindromes(iter, false, start, end, count)
    
    } else {
    
        count
        
    }

}