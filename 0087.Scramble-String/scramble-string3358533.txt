// https://leetcode.com/problems/scramble-string/solutions/3358533/rust-100-fastest-memoized-dp/
<-> denotes is scrambled into.

"great" "rgeat" > "g"<->"r" && "reat" <-> "geat" > "eat" <-> "eat" (I)
"great" "rgeat" > "gr" <-> "rg" && "eat" <-> "eat" (II)