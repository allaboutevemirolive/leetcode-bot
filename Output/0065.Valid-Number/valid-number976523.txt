// https://leetcode.com/problems/valid-number/solutions/976523/rust-enum-pattern-matching-is-so-convenient/
impl Solution {
    pub fn is_number(s: String) -> bool {
        s.chars()
         .try_fold(State::new(), State::handle)
		 .as_ref()
         // .map_or(false, State::is_valid)  // `.map_or()` was introduced in Rust 1.41.0
		 .map(State::is_valid).unwrap_or(false)
    }
}

type Result = std::result::Result<State, ()>;

enum State {
    Start,
    Sign,
    Integer,
    Dot,
    EmptyDot,
    Decimal,
    E,
    ExpSign,
    Exponent,
    End,
}

impl State {
    pub fn new() -> Self {
        State::Start
    }

    pub fn is_valid(&self) -> bool {
        use State::*;
        match self {
            Start | Sign | E | ExpSign | EmptyDot => false,
            _ => true,
        }
    }

    pub fn handle(self, c: char) -> Result {
        use State::*;
        match self {
            Start => match c {
                ' ' => Ok(Start),
                '+' | '-' => Ok(Sign),
                '0'..='9' => Ok(Integer),
                '.' => Ok(EmptyDot),
                _ => Err(()),
            }
            Sign => match c {
                '0'..='9' => Ok(Integer),
                '.' => Ok(EmptyDot),
                _ => Err(()),
            }
            Integer => match c {
                '0'..='9' => Ok(Integer),
                '.' => Ok(Dot),
                'e' => Ok(E),
                ' ' => Ok(End),
                _ => Err(()),
            }
            EmptyDot => match c {
                '0'..='9' => Ok(Decimal), // "  .1" or "  +.1"
                _ => Err(()),
            }
            Dot => match c {
                '0'..='9' => Ok(Decimal),
                'e' => Ok(E),   // "46.e3"
                ' ' => Ok(End),
                _ => Err(()),
            }
            Decimal => match c {
                '0'..='9' => Ok(Decimal),
                'e' => Ok(E),
                ' ' => Ok(End),
                _ => Err(()),
            }
            E => match c {
                '+' | '-' => Ok(ExpSign),
                '0'..='9' => Ok(Exponent),
                _ => Err(()),
            }
            ExpSign => match c {
                '0'..='9' => Ok(Exponent),
                _ => Err(()),
            }
            Exponent => match c {
                '0'..='9' => Ok(Exponent),
                ' ' => Ok(End),
                _ => Err(()),
            }
            End => match c {
                ' ' => Ok(End),
                _ => Err(()),
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::str::FromStr;

    #[test]
    fn test() {
        let cases = (
            // false
            vec![
                "+.",
                ".",
                "1.0e4.5",
                "-000111.xxaslkdfjaskldfj",
                "12 3",
                "1a3",
                "",
                "     ",
                "46.e",
                "1e",
                "+",
                "-",
                "+.",
                "-.",
            ],
            // true
            vec![
                "123",
                " 123 ",
                "0",
                "0123",  //Cannot agree
                "00",  //Cannot agree
                "-10",
                "-0",
                "123.5",
                "123.000000",
                "-500.777",
                "0.0000001",
                "0.00000",
                "0.",  //Cannot be more disagree!!!
                "00.5",  //Strongly cannot agree
                "123e1",
                "1.23e10",
                "0.5e-10",
                "0.5e04",
                ".1", //Ok, if you say so
                "2e0",  //Really?!
                "+.8",
                " 005047e+6",  //Damn = =|||
                "-123.456e-789",
                "46.e3",
            ]);

        let cases = cases.0.iter().map(|s| (false, s)).chain(cases.1.iter().map(|s| (true, s)));
        for (expect, &s) in cases {
            assert_eq!(expect, Solution::is_number(s.into()),
                "expect is_number(\"{}\") = {}, but got {}, try parse: {:?}", s, expect, !expect, f32::from_str(s.trim()));
        }
    }
}