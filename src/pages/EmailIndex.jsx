import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailSidebar } from '../cmps/EmailSidebar'

export function EmailIndex() {
    return (
        <section className="email-index">
            <EmailSidebar />
            <section className="email-main">
                <EmailFilter />
                <EmailList />
            </section>
        </section>
    )
}
