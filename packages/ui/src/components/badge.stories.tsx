import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Status pill used across SimPaddock to make a driver's or league's state explicit at a glance — never buried in copy. Domain variants map 1:1 to the states defined in the user-flow spec.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "seat-confirmed",
        "on-waitlist",
        "ineligible",
        "split-a",
        "split-b",
        "split-c",
        "league-host",
      ],
    },
    children: { control: "text" },
  },
  args: {
    children: "Badge",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SeatConfirmed: Story = {
  args: { variant: "seat-confirmed", children: "Seat Confirmed" },
};

export const OnWaitlist: Story = {
  args: { variant: "on-waitlist", children: "On Waitlist" },
};

export const Ineligible: Story = {
  args: { variant: "ineligible", children: "Ineligible" },
};

export const SplitA: Story = {
  name: "Split A",
  args: { variant: "split-a", children: "Split A" },
};

export const SplitB: Story = {
  name: "Split B",
  args: { variant: "split-b", children: "Split B" },
};

export const SplitC: Story = {
  name: "Split C",
  args: { variant: "split-c", children: "Split C" },
};

export const LeagueHost: Story = {
  args: { variant: "league-host", children: "League Host" },
};

export const Default: Story = {
  args: { variant: "default", children: "Default" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: "Every domain-specific badge variant side by side.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="seat-confirmed">Seat Confirmed</Badge>
      <Badge variant="on-waitlist">On Waitlist</Badge>
      <Badge variant="ineligible">Ineligible</Badge>
      <Badge variant="split-a">Split A</Badge>
      <Badge variant="split-b">Split B</Badge>
      <Badge variant="split-c">Split C</Badge>
      <Badge variant="league-host">League Host</Badge>
      <Badge variant="default">Default</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};
