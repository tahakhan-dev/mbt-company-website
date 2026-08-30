import type { Metadata } from "next";
import { adminListTeam } from "@/lib/admin/queries";
import { SimpleCrud } from "@/components/admin/SimpleCrud";

export const metadata: Metadata = { title: "Team" };

export default async function AdminTeamPage() {
  const team = await adminListTeam();
  return (
    <div className="space-y-5">
      <h1 className="text-lg font-semibold">Team</h1>
      <SimpleCrud
        collection="team"
        items={team}
        titleKey="name"
        subtitleKey="role"
        addLabel="Add team member"
        emptyTitle="No team members yet"
        emptyDetail="People shown on the About page and the home team preview."
        base={{ name: "", role: "", bio: "", photoUrl: "", socials: { linkedin: "", github: "", x: "" }, visible: true, order: (team.length + 1) * 10 }}
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          { key: "role", label: "Role", type: "text", required: true, placeholder: "Head of AI Engineering" },
          { key: "bio", label: "Short bio", type: "textarea" },
          { key: "photoUrl", label: "Photo URL", type: "url", placeholder: "https://res.cloudinary.com/… (empty = generated monogram)" },
          { key: "socials.linkedin", label: "LinkedIn URL", type: "url" },
          { key: "socials.github", label: "GitHub URL", type: "url" },
          { key: "socials.x", label: "X URL", type: "url" },
          { key: "visible", label: "Visible on the site", type: "checkbox" },
        ]}
      />
    </div>
  );
}
