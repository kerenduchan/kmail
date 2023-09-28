import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Outlet } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { EmailCompose } from './EmailCompose'
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailFolders } from '../cmps/EmailFolders'
import { Logo } from '../cmps/Logo'
import { EmailComposeButton } from '../cmps/EmailComposeButton'
import { SmallActionButton } from '../cmps/SmallActionButton'
import { MultiSelector } from '../cmps/MultiSelector'
import { emailService } from '../services/email.service'
import { getEmailFilterFromParams, sanitizeFilter } from '../util'
import {
    hideUserMsg,
    showErrorMsg,
    showSuccessMsg,
} from '../services/event-bus.service'

export function EmailIndex() {
    const [emailsData, setEmailsData] = useState(null)
    const [selectedEmailIds, setSelectedEmailIds] = useState([])
    const [emailCounts, setEmailCounts] = useState(null)
    const [multiSelectorState, setMultiSelectorState] = useState('none')
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [filter, setFilter] = useState(null)
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    // params and search params are the single source of truth for the filter
    useEffect(() => {
        setFilter(getEmailFilterFromParams(params, searchParams))
    }, [params, searchParams])

    useEffect(() => {
        if (filter !== null) {
            loadEmails()
        }
    }, [filter])

    useEffect(() => {
        if (selectedEmailIds.length === 0) {
            setMultiSelectorState('none')
        } else if (selectedEmailIds.length === emailsData.emails.length) {
            setMultiSelectorState('all')
        } else {
            setMultiSelectorState('some')
        }
    }, [selectedEmailIds])

    function onFolderClick(folder) {
        hideUserMsg()
        // go to the clicked folder, while retaining only the compose part
        // of the search params
        const navigateArgs = {
            pathname: `/email/${folder}`,
        }
        const composeVal = searchParams.get('compose')
        if (composeVal) {
            navigateArgs.search = `?compose=${composeVal}`
        }
        navigate(navigateArgs)
    }

    function onComposeClick() {
        hideUserMsg()
        // open the compose dialog, while staying in the same folder and
        // retaining the search params
        setSearchParams((prev) => {
            prev.set('compose', 'new')
            return prev
        })
    }

    function onFilterChange(fieldsToUpdate) {
        // update the search params accordingly
        setSearchParams((prev) => {
            const f = {
                ...getEmailFilterFromParams(prev, searchParams),
                ...fieldsToUpdate,
            }
            return sanitizeFilter(f)
        })
    }

    async function onUpdateEmail(email) {
        hideUserMsg()
        try {
            await emailService.save(email)
            await loadEmails()
        } catch (err) {
            showErrorMsg('Failed to update email', err)
        }
    }

    // Either move the email to the bin or delete it forever if it's already
    // in the bin.
    async function onDeleteEmail(email) {
        if (email.deletedAt !== null) {
            try {
                // permanently delete
                await emailService.remove(email.id)
                await loadEmails()
                showSuccessMsg('Email deleted forever.')
            } catch (err) {
                showErrorMsg('Failed to delete email forever.')
            }
        } else {
            try {
                // move to bin
                email.deletedAt = Date.now()
                await emailService.save(email)
                await loadEmails()
                showSuccessMsg(
                    filter.folder == 'drafts'
                        ? 'Draft discarded.'
                        : 'Email moved to Bin.'
                )
            } catch (err) {
                showErrorMsg(
                    filter.folder == 'drafts'
                        ? 'Failed to discard draft.'
                        : 'Failed to move email to Bin.'
                )
            }
        }
    }

    function onEmailComposeCloseClick() {
        // close the compose dialog
        setSearchParams((prev) => {
            prev.delete('compose')
        })
        loadEmails()
    }

    async function onDeleteDraft(emailId) {
        if (emailId !== null) {
            try {
                await emailService.remove(emailId)
                showSuccessMsg('Draft discarded.')
            } catch (err) {
                showErrorMsg('Failed to discard draft.')
            }
            loadEmails()
        }
        onEmailComposeCloseClick()
    }

    async function loadEmails() {
        try {
            let [emailCounts, emails] = await Promise.all([
                emailService.getEmailCountsPerFolder(),
                emailService.query(filter),
            ])
            setEmailsData({
                emails,
                folder: filter.folder,
            })
            setEmailCounts(emailCounts)
        } catch (err) {
            showErrorMsg('Error loading emails' + err)
        }
    }

    function onEmailClick(emailId) {
        hideUserMsg()
        if (params.folderId == 'drafts') {
            // edit draft
            setSearchParams((prev) => {
                return { ...prev, compose: emailId }
            })
        } else {
            // view email details, while retaining the search params
            navigate({
                pathname: `/email/${params.folderId}/${emailId}`,
                search: location.search,
            })
        }
    }

    function onEmailCheckboxClick(emailId, isChecked) {
        if (isChecked) {
            // deselect the email
            setSelectedEmailIds((prev) => prev.filter((id) => id != emailId))
        } else {
            // select the email
            setSelectedEmailIds((prev) => prev.concat([emailId]))
        }
    }

    function onHamburgerMenuClick() {
        setShowMenu((prev) => !prev)
    }

    function onEmailFoldersClose() {
        setShowMenu(false)
    }

    function onMultiSelectorFilterChange(filter) {
        switch (filter) {
            case 'none':
                setSelectedEmailIds([])
                break
            case 'all':
                setSelectedEmailIds(emailsData.emails.map((e) => e.id))
                break
        }
    }

    if (!emailsData || !emailCounts) return <div>Loading..</div>

    return (
        <section className="email-index">
            <SmallActionButton
                className="hamburger-menu-button"
                type="hamburger"
                onClick={onHamburgerMenuClick}
            />
            <Logo />
            <EmailFilter filter={filter} onChange={onFilterChange} />
            <EmailComposeButton onComposeClick={onComposeClick} />
            <EmailFolders
                className={showMenu ? 'visible' : ''}
                activeFolder={params.folderId}
                onFolderClick={onFolderClick}
                emailCounts={emailCounts}
                onClose={onEmailFoldersClose}
            />
            <section className="email-index-main">
                {params.emailId ? (
                    <Outlet />
                ) : (
                    <>
                        <div className="email-list-top">
                            <MultiSelector
                                state={multiSelectorState}
                                onFilterChange={onMultiSelectorFilterChange}
                            />
                        </div>
                        <EmailList
                            emailsData={{ ...emailsData, selectedEmailIds }}
                            onUpdateEmail={onUpdateEmail}
                            onDeleteEmail={onDeleteEmail}
                            onEmailClick={onEmailClick}
                            onEmailCheckboxClick={onEmailCheckboxClick}
                        />
                        <div className="email-list-bottom"></div>
                    </>
                )}
            </section>
            {/* Compose modal */}
            {searchParams.get('compose') !== null && (
                <EmailCompose
                    onCloseClick={onEmailComposeCloseClick}
                    onDeleteDraft={onDeleteDraft}
                />
            )}
        </section>
    )
}
