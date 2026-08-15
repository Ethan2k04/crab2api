package service

import (
	"testing"

	dbent "github.com/Wei-Shaw/sub2api/ent"
)

// These lock in which tiers the alpha withholds from purchase. When the month
// pass comes back, alphaSuspendedPlanTermDays empties out and this file goes
// with it.
func TestAlphaPlanSuspended(t *testing.T) {
	cases := []struct {
		name string
		days int
		unit string
		want bool
	}{
		{"day pass", 1, "day", false},
		{"week pass", 7, "day", false},
		{"week pass stored as 1 weeks", 1, "weeks", false},
		{"month pass", 30, "day", true},
		// The admin plan form saves plural units, so one 30-day term has three
		// possible spellings. Comparing the raw day count would miss two.
		{"month pass stored as 1 months", 1, "months", true},
		{"month pass stored as 1 month", 1, "month", true},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			plan := &dbent.SubscriptionPlan{ValidityDays: tc.days, ValidityUnit: tc.unit}
			if got := alphaPlanSuspended(plan); got != tc.want {
				t.Errorf("alphaPlanSuspended(%d %s) = %v, want %v", tc.days, tc.unit, got, tc.want)
			}
		})
	}
}

// A nil plan must not read as suspended: validateSubOrder has already rejected
// that case with its own error, and returning true here would mask it.
func TestAlphaPlanSuspendedNilPlan(t *testing.T) {
	if alphaPlanSuspended(nil) {
		t.Error("alphaPlanSuspended(nil) = true, want false")
	}
}
