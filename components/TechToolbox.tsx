import { skills } from "@/content/experience";
import { techLinks } from "@/content/tech";

export function TechToolbox() {
  const groups = Object.entries(skills);
  return <section className="book-toolbox" aria-labelledby="toolbox-title">
    <p className="micro entry-kicker">APPENDIX A / TECHNOLOGIES I HAVE WORKED WITH</p>
    <h2 className="project-title" id="toolbox-title">A growing toolbox.</h2>
    <dl className="toolbox-groups">{groups.map(([group, items]) => <div className="toolbox-group" key={group}>
      <dt>{group}</dt>
      <dd className="toolbox-tech-grid">{items.map(item => <div className="toolbox-slot" key={item}>
        {techLinks[item]
          ? <a className="toolbox-tech" href={techLinks[item]}>{item}</a>
          : <span className="toolbox-tech">{item}</span>}
      </div>)}</dd>
    </div>)}</dl>
    <p className="hand-note toolbox-note">the right tool is the one that helps you build.</p>
  </section>;
}
